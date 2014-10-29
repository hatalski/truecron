var Promise = require("bluebird"),
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


//
// ORGANIZATIONS
//

/**
 * Search for a single organization by ID.
 */
var findById = module.exports.findById = Promise.method(function (context, id, transaction) {
    return cache.get(getOrganizationIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Organization.find({ where: { id: id } }, { transaction: transaction })
                .then(function (organization) {
                    cache.put(getOrganizationIdCacheKey(id), organization);
                    return organization;
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
 */
var find = module.exports.find = Promise.method(function (context, options, transaction) {
    return models.Organization.find(options, { transaction: transaction })
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
 */
var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return models.Organization.findAndCountAll(options)
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
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes.updatedByPersonId = context.personId;
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        locals.tx = tx;
        return findById(context, id, tx)
            .then(function (organization) {
                if (organization === null) {
                    throw new errors.NotFound();
                }
                locals.oldOrganization = organization;
                return organization.updateAttributes(locals.attrs, { transaction: locals.tx });
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
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { tx: tx };
        return findById(context, id)
            .then(function (organization) {
                if (organization === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.organization = organization;
                return organization.destroy({transaction: locals.tx})
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

