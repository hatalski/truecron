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
    workspaceAccess = require('./workspace-access'),
    tools = require('./tools');

var using = Promise.using;

//
// Key strings to identify data in Redis
//

/**
 * Gets the specific workspace.
 */
var getWorkspaceIdCacheKey = function(workspaceId) {
    return 'ws/' + workspaceId;
};

//
// WORKSPACES
//

/**
 * Search for a single workspace by ID without security checks.
 */
var findByIdNoChecks = module.exports.findByIdNoChecks = Promise.method(function (context, id, transaction) {
    var locals = { cacheKey: getWorkspaceIdCacheKey(id) };
    return cache.get(locals.cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Workspace.find({ where: { id: id } }, { transaction: transaction })
                .then(function (workspace) {
                    cache.put(locals.cacheKey, workspace);
                    return workspace;
                });
        });
});

/**
 * Search for a single workspace by ID.
 * Organization Member role is required for this operation.
 */
var findById = module.exports.findById = Promise.method(function (context, id, workspaceRole, transaction) {
    workspaceRole = workspaceRole || workspaceAccess.WorkspaceRoles.Viewer;
    return workspaceAccess.findByIdAndEnsureAccess(context, id, workspaceRole, transaction);
});

/**
 * Search for a single workspace.
 * @param {object} options See Sequelize.find docs for details
 * Only workspaces the current user has access to are returned.
 */
var find = module.exports.find = Promise.method(function (context, options, transaction) {
    return tools.limitQueryToAccessibleOrganizations(context, options, transaction)
        .then(function (newOptions) {
            return models.Workspace.find(newOptions, { transaction: transaction });
        })
        .then(function (workspace) {
            if (workspace) {
                cache.put(getWorkspaceIdCacheKey(workspace.id), workspace);
            }
            return workspace;
        })
        .catch(function (err) {
            logger.error('Failed to find a workspace, %s.', err.toString());
            throw err;
        });
});

/**
 * Return an array of workspaces matching the query, paged if a limit was specified, and the total number of matching
 * organizations.
 * @param {object} options See Sequelize.findAndCountAll docs for details
 * ```
 * {
 *    rows: [ { "workspace": {...}}, { "workspace": {...}}, ...],
  *   count: 100
  *}
 * ```
 * Only workspaces the current user has access to are returned.
 */
var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return tools.limitQueryToAccessibleOrganizations(context, options)
        .then(function (newOptions) {
            return models.Workspace.findAndCountAll(newOptions);
        })
        .then(function (result) {
            // No need to cache pages of workspaces, but it makes sense to cache individual items
            result.rows.forEach(function(workspace) { cache.put(getWorkspaceIdCacheKey(workspace.id), workspace); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list workspaces, %s.', err.toString());
            throw err;
        });
});


/**
 * Create a new workspace.
 * @param {object} attributes Initial attributes values. organizationId and name are required.
 * @returns A newly created workspace.
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
        return organizationAccess.ensureHasAccess(context, locals.attrs.organizationId, organizationAccess.OrganizationRoles.Admin, tx)
            .then(function () {
                return models.Workspace.create(locals.attrs, { transaction: tx });
            })
            .then(function (workspace) {
                locals.workspace = workspace;
                return Promise.join(
                    history.logCreated(context.personId, { organizationId: workspace.organizationId, workspaceId: workspace.id },
                                       workspace, locals.tx),
                    cache.put(getWorkspaceIdCacheKey(workspace.id), workspace),
                    function () {
                        return locals.workspace;
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to create a workspace, %s.', err.toString());
        throw err;
    });
});

/**
 * Update the workspace.
 * @param {number|object} id ID or workspace instance to update.
 * @param {object} attributes Updated attributes values.
 * @returns An updated instance.
 * Workspace Editor role is required for this operation.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    delete attributes.organizationId; // Prevent moving of workspaces between organizations.
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        locals.tx = tx;
        return findById(context, id, workspaceAccess.WorkspaceRoles.Editor, locals.tx)
            .then(function (workspace) {
                if (workspace === null) {
                    throw new errors.NotFound();
                }
                locals.oldWorkspace = workspace;
                return workspace.updateAttributes(locals.attrs, { transaction: locals.tx });
            })
            .then(function (workspace) {
                locals.workspace = workspace;
                return Promise.join(
                    history.logUpdated(context.personId, { organizationId: workspace.organizationId, workspaceId: workspace.id },
                                       workspace, locals.oldWorkspace, locals.tx),
                    cache.put(getWorkspaceIdCacheKey(locals.workspace.id), locals.workspace),
                    function () {
                        return locals.workspace;
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to update the workspace %d, %s.', id, err.toString());
        throw err;
    });
});

/**
 * Remove the workspace.
 * @param {number|object} id ID or workspace instance to remove.
 * Workspace Editor role is required for this operation.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { tx: tx };
        return findById(context, id, workspaceAccess.WorkspaceRoles.Editor, locals.tx)
            .then(function (workspace) {
                if (workspace === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.workspace = workspace;
                return workspace.destroy({ transaction: locals.tx });
            })
            .then(function () {
                return Promise.join(
                    history.logRemoved(context.personId, { organizationId: locals.workspace.organizationId, workspaceId: locals.workspace.id },
                                       locals.workspace, locals.tx),
                    cache.remove(getWorkspaceIdCacheKey(locals.workspace.id)));
            });
    })
    .catch(function (err) {
        logger.error('Failed to remove the workspace %d, %s.', id, err.toString());
        throw err;
    });
});
