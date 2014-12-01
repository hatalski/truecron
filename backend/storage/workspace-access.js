var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors'),
    organizationAccess = require('./organization-access'),
    tools = require('./tools');

var using = Promise.using;

/**
 * Gets an array of workspaces the person has the 'editor' role for.
 */
var getEditableWorkspacesCacheKey = function(personId) {
    return 'person-ws/' + personId;
};

//
// Access control
//

var WorkspaceRole = function(name, value) {
    'use strict';
    this.name = name;
    this.value = value;
};

WorkspaceRole.prototype.includes = function (anotherRole) {
    return (this.value & anotherRole.value) === anotherRole.value;
};

WorkspaceRole.prototype.toString = function () {
    return this.name;
};

var WorkspaceRoles = module.exports.WorkspaceRoles = Object.freeze({
    Viewer: new WorkspaceRole('viewer', 1),
    Editor:  new WorkspaceRole('editor',  1+2), // Editor includes Viewer role

    parse: function (roleName) {
        if (!this.isValid(roleName)) {
            throw new errors.InvalidParams('Invalid workspace role value.');
        }
        return this.Editor.name === roleName
            ? this.Editor
            : this.Viewer;
    },

    isValid: function (roleName) {
        return validator.isIn(roleName, [this.Viewer.name, this.Editor.name]);
    }
});


/**
 * Get organizations (an { orgId1: role, orgId2: role,... } hash) accessible to the person identified by the security
 * context.
 */
var getEditableWorkspaces = module.exports.getEditableWorkspaces = Promise.method(function (context, transaction) {
    var cacheKey = getEditableWorkspacesCacheKey(context.personId);
    return cache.get(cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.WorkspaceToPerson.findAll({
                where: { personId: context.personId, role: 'editor' },
                order: 'workspaceId'
            }, { transaction: transaction })
                .then(function (records) {
                    var accessEntries = records.reduce(function (result, entry) {
                        result[entry.workspaceId] = WorkspaceRoles.parse(entry.role);
                        return result;
                    }, {});
                    cache.put(cacheKey, accessEntries);
                    return accessEntries;
                });
        })
        .catch(function (err) {
            logger.error('Failed to get workspaces editable by the person id %s, %s.', context.personId, err.toString());
            throw err;
        });
});

/**
 * Throws 'access denied' error if a user does not have the role specified, or returns user's {WorkspaceRole}.
 * The role 'Editor' includes the 'Viewer' role, so if a 'Viewer' is requested both 'Editor' and 'Viewer' pass the check.
 * Organization roles affect this check. Organization admins can edit any workspace, organization members can view any workspace.
 * Moreover, a user needs to be at least an organization member to view workspaces.
 * @param context {Context} Current security context.
 * @param organization {object|number} An organization object or ID of the organization the workspace belongs to.
 * @param workspace {object|number} A workspace object or ID of the workspace to check access to.
 * @param requiredRole {WorkspaceRole} A role the user should have.
 * @return {WorkspaceRole} A role the user has.
 */
var ensureHasAccess = module.exports.ensureHasAccess = Promise.method(function (context, organization, workspace, requiredRole, transaction) {
    if (context.isSystem()) {
        return WorkspaceRoles.Editor;
    }
    var orgId = tools.getId(organization);
    return organizationAccess.ensureHasAccess(context, organization, organizationAccess.OrganizationRoles.Member, transaction)
        .then(function (organizationRole) {
            // Organization admins can edit any workspace
            if (organizationRole.equals(organizationAccess.OrganizationRoles.Admin)) {
                return WorkspaceRoles.Editor;
            }
            // All members of the organization have implicit Viewer role on all workspaces of the organization
            if (requiredRole.equals(WorkspaceRoles.Viewer)) {
                return WorkspaceRoles.Viewer;
            }
            return getEditableWorkspaces(context, transaction)
                .then(function (accessEntries) {
                    var wsId = tools.getId(workspace);
                    var role = accessEntries[wsId];
                    var hasAccess = role && role.includes(requiredRole);
                    if (!hasAccess) {
                        throw new errors.AccessDenied(
                            util.format('Access denied. Role "%s" is required to perform the operation on the workspace %d.',
                                requiredRole.name, wsId),
                            {
                                organizationId: orgId,
                                workspaceId: wsId,
                                requiredRole: requiredRole.name,
                                personId: context.personId
                            });
                    }
                    return role;
                });
        });
});

/**
 * Grant access to the workspace.
 * @param context {Context} Current security context.
 * @param workspaceId {number} ID of the workspace to grant access to.
 * @param personId {number} ID of the person to grant access.
 * @param role {string} Role to assign.
 * Only organization admins can grant permissions to workspaces.
 * An existing role is replaced if any.
 */
var grantAccess = module.exports.grantAccess = Promise.method(function (context, workspaceId, personId, roleName) {
    workspaceId = tools.getId(workspaceId);
    personId = tools.getId(personId);
    var role = WorkspaceRoles.parse(roleName);
    var locals = {};
    return using(models.transaction(), function (tx) {
        return models.Workspace.find({ id: workspaceId }, { transaction: tx })
            .then(function (workspace) {
                if (!workspace) {
                    throw new errors.NotFound();
                }
                locals.organizationId = workspace.organizationId;
                // A user needs to be organization's admin to modify workspace permissions
                return organizationAccess.ensureHasAccess(context, workspace.organizationId, organizationAccess.OrganizationRoles.Admin, tx);
            })
            .then(function() {
                return models.WorkspaceToPerson.find({
                    where: { workspaceId: workspaceId, personId: personId }
                }, { transaction: tx });
            })
            .then(function (accessEntry) {
                if (accessEntry && accessEntry.role === role.name) {
                    // The person already has the required role, nothing to do.
                    return accessEntry;
                }

                return Promise.try(function() {
                    if (!accessEntry) {
                        return models.WorkspaceToPerson.create({
                            workspaceId: workspaceId,
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
                        history.logAccessGranted(context.personId, context.links.workspace(workspaceId), newAccessEntry, tx),
                        cache.remove(getEditableWorkspacesCacheKey(personId)),
                        function() {
                            return newAccessEntry;
                        });
                });
            });
    })
        .catch(function (err) {
            logger.error('Failed to grant role %s to the person %d on the workspace %d , %s.', roleName, personId, workspaceId, err.toString());
            throw err;
        });
});

/**
 * Revoke access from the person on the workspace.
 * @param context {Context} Current security context.
 * @param workspace {number|object} ID or an instance of the workspace to revoke access on.
 * @param personId {number} ID of the person to revoke access from.
 * Only organization admins can revoke workspace permissions. The function does not fail if the specified person does not have roles assigned.
 */
var revokeAccess = module.exports.revokeAccess = Promise.method(function (context, workspaceId, personId) {
    workspaceId = tools.getId(workspaceId);
    personId = tools.getId(personId);
    var locals = {};
    return using(models.transaction(), function (tx) {
        locals.tx = tx;
        return models.Workspace.find({ id: workspaceId }, { transaction: tx })
            .then(function (workspace) {
                if (!workspace) {
                    throw new errors.NotFound();
                }
                locals.organizationId = workspace.organizationId;
                // A user needs to be organization's admin to modify workspace permissions
                return organizationAccess.ensureHasAccess(context, workspace.organizationId, organizationAccess.OrganizationRoles.Admin, tx);
            })
            .then(function(){
                return models.WorkspaceToPerson.find({
                    where: { workspaceId: workspaceId, personId: personId }
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
                        return history.logAccessRevoked(context.personId, context.links.workspace(workspaceId), locals.accessEntry, locals.tx);
                    })
                    .then(function() {
                        cache.remove(getEditableWorkspacesCacheKey(personId));
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to revoke access from the person %d on the workspace %d , %s.', personId, workspaceId, err.toString());
            throw err;
        });
});

/**
 * Get a paged list of people and their roles for the specified workspace.
 * @param context {Context} Current security context.
 * @param organization {number|object} ID or an instance of the organization the workspace belongs to.
 * @param workspace {number|object} ID or an instance of the workspace to get an access list of.
 * @param options {object} See Sequelize.findAndCountAll docs for details.
 * @return
 * ```
 * {
 *    rows: [ { "entry": { personId: 1, role: 'editor' }}, { "entry": { personId: 2, role: 'editor' }}, ...],
  *   count: 10
  *}
 * ```
 */
var getAccessList = module.exports.getAccessList = Promise.method(function (context, organization, workspace, options, transaction) {
    return ensureHasAccess(context, organization, workspace, WorkspaceRoles.Viewer, transaction)
        .then(function () {
            options = _.merge(options || {}, { where: { workspaceId: tools.getId(workspace) } });
            return models.WorkspaceToPerson.findAndCountAll(options, { transaction: transaction });
        })
        .catch(function (err) {
            logger.error('Failed to get access list of the workspace %d , %s.', tools.getId(workspace), err.toString());
            throw err;
        });
});

