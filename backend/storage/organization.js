var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

var using = Promise.using;

//
// Key strings to identify data in Redis
//

/**
 * Gets the specific organization.
 */
var getOrganizationIdCacheKey = function(organizationId) {
    return 'org/' + organizationId;
};

/**
 * Gets an array of accessible organizations for the specific person.
 */
var getAccessibleOrganizationsCacheKey = function(personId) {
    return 'person-orgs/' + personId;
};

//
// Access control
//

var OrganizationRole = function(name, value) {
    'use strict';
    this.name = name;
    this.value = value;
};

OrganizationRole.prototype.includes = function (anotherRole) {
    return (this.value & anotherRole.value) === anotherRole.value;
};

OrganizationRole.prototype.toString = function () {
    return this.name;
};

var OrganizationRoles = Object.freeze({
    Member: new OrganizationRole('member', 1),
    Admin:  new OrganizationRole('admin',  1+2),

    parse: function (roleName) {
        if (!this.isValid(roleName)) {
            throw new errors.InvalidParams('Invalid role value.');
        }
        return this.Admin.name === roleName
            ? this.Admin
            : this.Member;
    },

    isValid: function (roleName) {
        return validator.isIn(roleName, [this.Member.name, this.Admin.name]);
    }
});


/**
 * Get organizations (an { orgId1: role, orgId2: role,... } hash) accessible to the person identified by the security
 * context.
 */
var getAccessibleOrganizations = module.exports.getAccessibleOrganizations = Promise.method(function (context, transaction) {
    var cacheKey = getAccessibleOrganizationsCacheKey(context.personId);
    return cache.get(cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.OrganizationToPerson.findAll({
                    where: { personId: context.personId },
                    order: 'organizationId'
                }, { transaction: transaction })
                .then(function (records) {
                    var accessEntries = records.reduce(function (result, entry) {
                        result[entry.organizationId] = OrganizationRoles.parse(entry.role);
                        return result;
                    }, {});
                    cache.put(cacheKey, accessEntries);
                    return accessEntries;
                });
        })
        .catch(function (err) {
            logger.error('Failed to get organizations accessible to the person id %s, %s.', context.personId, err.toString());
            throw err;
        });
});

var getId = function(idOrObject) {
    var id = idOrObject;
    if (typeof idOrObject === 'object') {
        id = idOrObject.id;
    }
    if (!validator.isInt(id)) {
        throw new errors.InvalidParams('Invalid ID.');
    }
    return +id;
};

var ensureHasAccess = module.exports.ensureHasAccess = Promise.method(function (context, organization, requiredRole, transaction) {
    if (context.isSystem()) {
        return true;
    }
    var orgId = getId(organization);
    return getAccessibleOrganizations(context, transaction)
        .then(function (accessEntries) {
            var role = accessEntries[orgId];
            var hasAccess = role && role.includes(requiredRole);
            if (!hasAccess) {
                throw new errors.AccessDenied(
                    util.format('Access denied. Role "%s" is required to perform the operation on the organization %d.',
                        requiredRole.name, orgId),
                    {
                        organizationId: orgId,
                        requiredRole: requiredRole.name,
                        personId: context.personId
                    });
            }
        });
});

/**
 * Grant access to the organization.
 * @param context {Context} Current security context.
 * @param organizationId {number} ID of the organization to grant access to.
 * @param personId {number} ID of the person to grant access.
 * @param role {string} Role to assign.
 * Only admins can grant permissions. An existing role is replaced if any.
 */
var grantAccess = module.exports.grantAccess = Promise.method(function (context, organizationId, personId, roleName) {
    var role = OrganizationRoles.parse(roleName);
    return using(models.transaction(), function (tx) {
        return ensureHasAccess(context, organizationId, OrganizationRoles.Admin, tx)
            .then(function() {
                return models.OrganizationToPerson.find({
                    where: { organizationId: organizationId, personId: personId }
                }, { transaction: tx });
            })
            .then(function (accessEntry) {
                if (accessEntry && accessEntry.role === role.name) {
                    // The person already has the required role, nothing to do.
                    return accessEntry;
                }

                return Promise.try(function() {
                    if (!accessEntry) {
                        return models.OrganizationToPerson.create({
                            organizationId: organizationId,
                            personId: personId,
                            role: role.name,
                            updatedByPersonId: context.personId
                        }, { transaction: tx });
                    } else {
                        return accessEntry.updateAttributes({
                            role: role.name,
                            updatedByPersonId: context.personId
                        }, { transaction: tx });
                    }
                })
                .then(function (newAccessEntry) {
                    return Promise.join(
                        history.logAccessGranted(context.personId, getOrganizationIdCacheKey(organizationId), newAccessEntry, tx),
                        cache.remove(getAccessibleOrganizationsCacheKey(personId)),
                        function() {
                            return newAccessEntry;
                        });
                });
            });
    })
    .catch(function (err) {
        logger.error('Failed to grant role %s to the person %d on the organization %d , %s.', roleName, personId, organizationId, err.toString());
        throw err;
    });
});

/**
 * Revoke access from the person on the organization.
 * @param context {Context} Current security context.
 * @param organizationId {number} ID of the organization to revoke access on.
 * @param personId {number} ID of the person to revoke access from.
 * Only admins can revoke permissions. The function does not fail if the specified person does not have roles assigned.
 */
var revokeAccess = module.exports.revokeAccess = Promise.method(function (context, organizationId, personId) {
    var locals = {};
    return using(models.transaction(), function (tx) {
        locals.tx = tx;
        return ensureHasAccess(context, organizationId, OrganizationRoles.Admin, tx)
            .then(function(){
                return models.OrganizationToPerson.find({
                    where: { organizationId: organizationId, personId: personId }
                }, { transaction: locals.tx });
            })
            .then(function (accessEntry) {
                if (!accessEntry) {
                    // The person has no permissions
                    return null;
                }
                locals.accessEntry = accessEntry;
                return accessEntry.destroy({ transaction: locals.tx })
                    .then(function() {
                        return history.logAccessRevoked(context.personId, getOrganizationIdCacheKey(organizationId), locals.accessEntry, locals.tx);
                    })
                    .then(function() {
                        cache.remove(getAccessibleOrganizationsCacheKey(personId));
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to revoke access from the person %d on the organization %d , %s.', personId, organizationId, err.toString());
        throw err;
    });
});

/**
 * Get access a paged list people and their roles for the specified organization.
 * @param context {Context} Current security context.
 * @param organizationId {number} ID of the organization to get an access list of.
 * @param options {object} See Sequelize.findAndCountAll docs for details.
 * @return
 * ```
 * {
 *    rows: [ { "entry": { personId: 1, role: 'admin' }}, { "entry": { personId: 2, role: 'member' }}, ...],
  *   count: 10
  *}
 * ```
 */
var getAccessList = module.exports.getAccessList = Promise.method(function (context, organizationId, options, transaction) {
    return ensureHasAccess(context, organizationId, OrganizationRoles.Member, transaction)
        .then(function () {
            options = _.merge(options || {}, { where: { organizationId: organizationId } });
            return models.OrganizationToPerson.findAndCountAll(options, { transaction: transaction });
        })
        .catch(function (err) {
            logger.error('Failed to get access list of the organization %d , %s.', organizationId, err.toString());
            throw err;
        });
});

//
// ORGANIZATIONS
//

/**
 * Search for a single organization by ID.
 * Member role is required for this operation.
 */
var findById = module.exports.findById = Promise.method(function (context, id, transaction) {
    var locals = { cacheKey: getOrganizationIdCacheKey(id) };
    return cache.get(locals.cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Organization.find({ where: { id: id } }, { transaction: transaction })
                .then(function (organization) {
                    cache.put(locals.cacheKey, organization);
                    return organization;
                });
        })
        .then(function (organization) {
            if (!organization) {
                return null;
            }
            locals.organization = organization;
            return ensureHasAccess(context, locals.organization.id, OrganizationRoles.Member, transaction)
                .then(function () {
                    return locals.organization;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find an organization by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Search for a single organization.
 * @param {object} options See Sequelize.find docs for details
 * Only organizations the current user has access to are returned.
 */
var find = module.exports.find = Promise.method(function (context, options, transaction) {
    return getAccessibleOrganizations(context, transaction)
        .then(function (accessEntries) {
            var accessibleIds = _.keys(accessEntries);
            options = _.merge(options, { where: { id: accessibleIds } });
            return models.Organization.find(options, { transaction: transaction });
        })
        .then(function (organization) {
            if (!!organization) {
                cache.put(getOrganizationIdCacheKey(organization.id), organization);
            }
            return organization;
        })
        .catch(function (err) {
            logger.error('Failed to find an organization, %s.', err.toString());
            throw err;
        });
});

/**
 * Return an array of organizations matching the query, paged if a limit was specified, and the total number of matching
 * organizations.
 * @param {object} options See Sequelize.findAndCountAll docs for details
 * ```
 * {
 *    rows: [ { "organization": {...}}, { "organization": {...}}, ...],
  *   count: 100
  *}
 * ```
 * Only organizations the current user has access to are returned.
 */
var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return getAccessibleOrganizations(context)
        .then(function (accessEntries) {
            var accessibleIds = _.keys(accessEntries);
            options = _.merge(options, {where: {id: accessibleIds}});
            return models.Organization.findAndCountAll(options);
        })
        .then(function (result) {
            // No need to cache pages of orgs, but it makes sense to cache individual organizations
            result.rows.forEach(function(organization) { cache.put(getOrganizationIdCacheKey(organization.id), organization); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list organizations, %s.', err.toString());
            throw err;
        });
});

/**
 * Create a new organization.
 * @param {object} attributes Initial attributes values. name is required.
 * @returns A newly created organization.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    if (!attributes || validator.isNull(attributes.name)) {
        throw new errors.InvalidParams('name is required');
    }
    attributes.updatedByPersonId = context.personId;
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        locals.tx = tx;
        return models.Organization.create(locals.attrs, { transaction: tx })
            .then(function (organization) {
                locals.organization = organization;
                return history.logCreated(context.personId, getOrganizationIdCacheKey(organization.id), organization, locals.tx);
            })
            .then(function() {
                // Grant an 'admin' role to the current user on the newly created organization
                return models.OrganizationToPerson.create({
                    organizationId: locals.organization.id,
                    personId: context.personId,
                    role: 'admin',
                    updatedByPersonId: context.personId
                }, { transaction: locals.tx });
            })
            .then(function () {
                cache.put(getOrganizationIdCacheKey(locals.organization.id), locals.organization);
                return locals.organization;
            });
    })
    .catch(function (err) {
        logger.error('Failed to create an organization, %s.', err.toString());
        throw err;
    });
});

/**
 * Update an organization.
 * @param {int} id Organization ID.
 * @param {object} attributes Updated attributes values.
 * @returns An updated instance.
 * Admin role is required for this operation.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes.updatedByPersonId = context.personId;
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        locals.tx = tx;
        return findById(context, id, locals.tx)
            .then(function (organization) {
                if (organization === null) {
                    throw new errors.NotFound();
                }
                locals.oldOrganization = organization;
                return ensureHasAccess(context, id, OrganizationRoles.Admin, locals.tx);
            })
            .then(function() {
                return locals.oldOrganization.updateAttributes(locals.attrs, { transaction: locals.tx });
            })
            .then(function (organization) {
                locals.organization = organization;
                return history.logUpdated(context.personId, getOrganizationIdCacheKey(organization.id), organization, locals.oldOrganization, locals.tx);
            })
            .then(function () {
                cache.put(getOrganizationIdCacheKey(locals.organization.id), locals.organization);
                return locals.organization;
            });
    })
    .catch(function (err) {
        logger.error('Failed to update the organization %d, %s.', id, err.toString());
        throw err;
    });
});

/**
 * Remove an organization.
 * @param {int} id Organization ID.
 * Admin role is required for this operation.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { tx: tx };
        return findById(context, id, locals.tx)
            .then(function (organization) {
                if (organization === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.organization = organization;
                return ensureHasAccess(context, id, OrganizationRoles.Admin, locals.tx)
                    .then(function () {
                        return locals.organization.destroy({ transaction: locals.tx });
                    })
                    .then(function () {
                        return history.logRemoved(context.personId, getOrganizationIdCacheKey(locals.organization.id), locals.organization, locals.tx);
                    })
                    .then(function () {
                        cache.remove(getOrganizationIdCacheKey(locals.organization.id));
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to remove the organization %d, %s.', id, err.toString());
        throw err;
    });
});

