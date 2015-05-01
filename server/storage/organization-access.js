var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools');

var using = Promise.using;

//
// ORGANIZATIONS ACCESS CONTROL
//

//
// Key strings to identify data in Redis
//

/**
 * Gets an array of accessible organizations for the specific person.
 */
var getAccessibleOrganizationsCacheKey = function(personId) {
    return 'person-orgs/' + personId;
};

var OrganizationRole = function(name, value) {
    'use strict';
    this.name = name;
    this.value = value;
};

OrganizationRole.prototype.includes = function (anotherRole) {
    return (this.value & anotherRole.value) === anotherRole.value;
};

OrganizationRole.prototype.equals = function (other) {
    return this.name === other.name;
};

OrganizationRole.prototype.toString = function () {
    return this.name;
};

var OrganizationRoles = module.exports.OrganizationRoles = Object.freeze({
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
                order: '"organizationId"'
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

/**
 * Throws 'access denied' error if a user does not have the role specified, or returns user's {OrganizationRole}.
 * The role 'Admin' includes the 'Member' role, so if a 'Member' is requested both 'Admin' and 'Member' pass the check.
 */
var ensureHasAccess = module.exports.ensureHasAccess = Promise.method(function (context, organization, requiredRole, transaction) {
    if (context.isSystem()) {
        return OrganizationRoles.Admin;
    }
    var orgId = tools.getId(organization);
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
            return role;
        });
});

/**
 * Throws 'access denied' error if a user does cannot edit the organization.
 * This is a shortcut for ensureHasAccess with the Admin role.
 */
var ensureCanEdit = module.exports.ensureCanEdit = Promise.method(function (context, organization, transaction) {
    return ensureHasAccess(context, organization, OrganizationRoles.Admin, transaction);
});

/**
 * Throws 'access denied' error if a user does cannot view the organization.
 * This is a shortcut for ensureHasAccess with the Member role.
 */
var ensureCanView = module.exports.ensureCanView = Promise.method(function (context, organization, transaction) {
    return ensureHasAccess(context, organization, OrganizationRoles.Member, transaction);
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
                            history.logAccessGranted(context.personId, { organizationId: organizationId }, newAccessEntry, tx),
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
                        return history.logAccessRevoked(context.personId, { organizationId: organizationId }, locals.accessEntry, locals.tx);
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

