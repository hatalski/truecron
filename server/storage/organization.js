var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    access = require('./organization-access');

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
            return access.ensureHasAccess(context, locals.organization.id, access.OrganizationRoles.Member, transaction)
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
    return access.getAccessibleOrganizations(context, transaction)
        .then(function (accessEntries) {
            if (!context.isSystem()) {
                var accessibleIds = _.keys(accessEntries);
                options = _.merge(options, {where: {id: accessibleIds}});
            }
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
    return access.getAccessibleOrganizations(context)
        .then(function (accessEntries) {
            if (!context.isSystem()) {
                var accessibleIds = _.keys(accessEntries);
                options = _.merge(options, {where: {id: accessibleIds}});
            }
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
    //if (!context.isSystem()) {
    //    throw new errors.AccessDenied('Only SYSTEM can create new organizations.');
    //}
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
                return history.logCreated(context.personId, { organizationId: organization.id }, organization, locals.tx);
            })
            .then(function() {
                // Grant an 'admin' role to the current user on the newly created organization
                return models.OrganizationToPerson.create({
                    organizationId: locals.organization.id,
                    personId: context.personId,
                    role: access.OrganizationRoles.Admin.name,
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
                return access.ensureHasAccess(context, id, access.OrganizationRoles.Admin, locals.tx);
            })
            .then(function() {
                return locals.oldOrganization.updateAttributes(locals.attrs, { transaction: locals.tx });
            })
            .then(function (organization) {
                locals.organization = organization;
                return history.logUpdated(context.personId, { organizationId: organization.id }, organization, locals.oldOrganization, locals.tx);
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
                return access.ensureHasAccess(context, id, access.OrganizationRoles.Admin, locals.tx)
                    .then(function () {
                        return locals.organization.destroy({ transaction: locals.tx });
                    })
                    .then(function () {
                        return history.logRemoved(context.personId, { organizationId: locals.organization.id }, locals.organization, locals.tx);
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

