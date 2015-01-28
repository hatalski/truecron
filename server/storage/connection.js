var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    organizationAccess = require('./organization-access'),
    tools = require('./tools');

var using = Promise.using;

//
// Key strings to identify data in Redis
//

/**
 * Gets the specific connection.
 */
var getConnectionIdCacheKey = function(connectionId) {
    return 'c/' + connectionId;
};

//
// CONNECTIONS
//

/**
 * Search for a single connection by ID without security checks.
 */
var findByIdNoChecks = module.exports.findByIdNoChecks = Promise.method(function (context, id, transaction) {
    var locals = { cacheKey: getConnectionIdCacheKey(id) };
    return cache.get(locals.cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Connection.find({ where: { id: id } }, { transaction: transaction })
                .then(function (connection) {
                    cache.put(locals.cacheKey, connection);
                    return connection;
                });
        });
});

/**
 * Search for a single connection by ID.
 */
var findById = module.exports.findById = Promise.method(function (context, id, forEdit, transaction) {
    var locals = {};
    forEdit = (!!forEdit) || false;
    return findByIdNoChecks(context, id, transaction)
        .then(function (connection) {
            if (!connection) {
                return connection;
            }
            locals.connection = connection;
            if (forEdit) {
                return organizationAccess.ensureCanEdit(context, connection.organizationId, transaction);
            } else {
                return organizationAccess.ensureCanView(context, connection.organizationId, transaction);
            }
        })
        .then(function () {
            return locals.connection;
        });
});

/**
 * Search for a single connection.
 * @param {object} options See Sequelize.find docs for details
 * Only connections the current user has access to are returned.
 */
var find = module.exports.find = Promise.method(function (context, options, transaction) {
    return tools.limitQueryToAccessibleOrganizations(context, options, transaction)
        .then(function (newOptions) {
            return models.Connection.find(newOptions, { transaction: transaction });
        })
        .then(function (connection) {
            if (connection) {
                cache.put(getConnectionIdCacheKey(connection.id), connection);
            }
            return connection;
        })
        .catch(function (err) {
            logger.error('Failed to find a connection, %s.', err.toString());
            throw err;
        });
});

/**
 * Return an array of connections matching the query, paged if a limit was specified, and the total number of matching
 * organizations.
 * @param {object} options See Sequelize.findAndCountAll docs for details
 * ```
 * {
 *    rows: [ { "connection": {...}}, { "connection": {...}}, ...],
  *   count: 100
  *}
 * ```
 * Only connections the current user has access to are returned.
 */
var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return tools.limitQueryToAccessibleOrganizations(context, options)
        .then(function (newOptions) {
            return models.Connection.findAndCountAll(newOptions);
        })
        .then(function (result) {
            // No need to cache pages of connections, but it makes sense to cache individual items
            result.rows.forEach(function(connection) { cache.put(getConnectionIdCacheKey(connection.id), connection); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list connections, %s.', err.toString());
            throw err;
        });
});


/**
 * Create a new connection.
 * @param {object} attributes Initial attributes values. organizationId and name are required.
 * @returns A newly created connection.
 * Organization Admin role is required.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    if (!attributes.organizationId) {
        throw new errors.InvalidParams('organizationId is required');
    }
    if (!attributes.name) {
        throw new errors.InvalidParams('Workspace name is required');
    }
    var locals = { attrs: attributes };
    return using(models.transaction(), function (tx) {
        locals.tx = tx;
        return organizationAccess.ensureCanEdit(context, locals.attrs.organizationId, tx)
            .then(function () {
                return models.Connection.create(locals.attrs, { transaction: tx });
            })
            .then(function (connection) {
                locals.connection = connection;
                return Promise.join(
                    history.logCreated(context.personId, { organizationId: connection.organizationId, connectionId: connection.id },
                        connection, locals.tx),
                    cache.put(getConnectionIdCacheKey(connection.id), connection),
                    function () {
                        return locals.connection;
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to create a connection, %s.', err.toString());
            throw err;
        });
});

/**
 * Update the connection.
 * @param {number|object} id ID or connection instance to update.
 * @param {object} attributes Updated attributes values.
 * @returns An updated instance.
 * Organization Admin role is required for this operation.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    delete attributes.organizationId; // Prevent moving of connections between organizations.
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return findById(context, id, true, tx) // findById checks access rights
            .then(function (connection) {
                if (connection === null) {
                    throw new errors.NotFound();
                }
                locals.oldConnection = connection;
                return connection.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function (connection) {
                locals.connection = connection;
                return Promise.join(
                    history.logUpdated(context.personId, { organizationId: connection.organizationId, connectionId: connection.id },
                        connection, locals.oldConnection, tx),
                    cache.put(getConnectionIdCacheKey(locals.connection.id), locals.connection),
                    function () {
                        return locals.connection;
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to update the connection %d, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Remove the connection.
 * @param {number|object} id ID or connection instance to remove.
 * Organization Admin role is required for this operation.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = {};
        return findById(context, id, true, tx) // findById checks access rights
            .then(function (connection) {
                if (connection === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.connection = connection;
                return connection.destroy({ transaction: tx });
            })
            .then(function () {
                return Promise.join(
                    history.logRemoved(context.personId, { organizationId: locals.connection.organizationId, connectionId: locals.connection.id },
                        locals.connection, tx),
                    cache.remove(getConnectionIdCacheKey(locals.connection.id)));
            });
    })
        .catch(function (err) {
            logger.error('Failed to remove the connection %d, %s.', id, err.toString());
            throw err;
        });
});
