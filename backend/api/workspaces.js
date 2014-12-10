'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common'),
    jobs = require('./jobs');

var api = express.Router();

/**
 * Format a workspace object retrieved from a database to be returned from the API.
 */
function formatWorkspace(req, workspace) {
    if (workspace === undefined) {
        return workspace;
    }
    var ws = workspace.toJSON();
    ws._links = {
        self: req.context.links.workspace({ workspaceId: ws.id }),
        jobs: req.context.links.jobs({ workspaceId: ws.id }),
        history: req.context.links.workspaceHistory({ workspaceId: ws.id })
    };
    common.formatApiOutput(ws);
    return { workspace: ws };
}

//
// Workspaces are designed to be mounted under organizations. I.e. req.organization is already set
// to an organization instance and current user has at least member privileges.
//
api.route('/workspaces')
    //
    // List workspaces of the req.organization.
    //
    .get(common.parseListParams, function (req, res, next) {
        if (!req.organization) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        var where = { organizationId: req.organization.id };
        if (req.listParams.searchTerm) {
            where = _.merge(where, { name: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'name';

        storage.Workspace.findAndCountAll(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                workspaces: result.rows.map(formatWorkspace.bind(null, req)),
                meta: {
                    total: result.count
                }});
        })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Add a new workspace to the req.organization.
    //
    .post(function (req, res, next) {
        if (!req.organization) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        req.checkBody('workspace.name', 'Invalid workspace name.').isLength(1, 255);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        req.body.workspace.organizationId = req.organization.id;
        storage.Workspace.create(req.context, req.body.workspace)
            .then(function (workspace) {
                res.status(201).json(formatWorkspace(req, workspace));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('workspaceid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid workspace ID.'));
    }
    storage.Workspace.findById(req.context, id)
        .then(function (workspace) {
            if (workspace !== null) {
                req.workspace = workspace;
                req.context.links.workspaceId = workspace.id;
                next();
            } else {
                next(new apiErrors.NotFound());
            }
        })
        .catch(function (err) {
            logger.error(err.toString());
            next(err);
        });
});

api.route('/workspaces/:workspaceid')
    //
    // Get a workspace
    //
    .get(function (req, res, next) {
        res.json(formatWorkspace(req, req.workspace));
    })
    //
    // Update the workspace
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.workspace) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Workspace.update(req.context, req.workspace.id, req.body.workspace)
            .then(function (workspace) {
                res.json(formatWorkspace(req, workspace));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Delete the workspace
    //
    .delete(function (req, res, next) {
        storage.Workspace.remove(req.context, req.workspace.id)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });


//
// WORKSPACE MEMBERS
//

function formatMember(req, member) {
    // TODO: Include person name/email
    var result = {
        userId: member.personId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        updatedByUserId: member.updatedByPersonId,
        _links: {
            self: req.context.links.workspaceMember(member.personId),
            user: req.context.links.user(member.personId)
        }
    };
    common.formatApiOutput(result);
    return { member: result };
}

api.route('/workspaces/:workspaceid/members')
    //
    // List members with roles
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = { };
        if (req.listParams.searchTerm) {
            where = { role: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'updatedAt';
        storage.WorkspaceAccess.getAccessList(req.context, req.organization, req.workspace, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                members: result.rows.map(formatMember.bind(null, req)),
                meta: {
                    total: result.count
                }});
        })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Add a new member
    //
    .post(function (req, res, next) {
        req.checkBody('member.userId', 'Invalid user ID.').isInt();
        req.checkBody('member.role', 'Invalid role value. Must be "editor" or "viewer".').isIn(['editor', 'viewer']);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        storage.WorkspaceAccess.grantAccess(req.context, req.workspace, req.body.member.userId, req.body.member.role)
            .then(function (member) {
                res.status(201).json(formatMember(req, member));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('wsmemberid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid member ID.'));
    }
    req.workspaceMemberId = +id;
    req.context.links.workspaceMemberId = +id;
    next();
});

api.route('/workspaces/:workspaceid/members/:wsmemberid')
    //
    // Get a member
    //
    .get(function (req, res, next) {
        next(new apiErrors.NotSupported());
    })
    //
    // Update a member
    //
    .put(function (req, res, next) {
        req.checkBody('member.role', 'Invalid role value. Must be "editor" or "viewer".').isIn(['editor', 'viewer']);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        storage.WorkspaceAccess.grantAccess(req.context, req.workspace, req.workspaceMemberId, req.body.member.role)
            .then(function (member) {
                res.json(formatMember(req, member));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Delete an member
    //
    .delete(function (req, res, next) {
        storage.WorkspaceAccess.revokeAccess(req.context, req.workspace, req.workspaceMemberId)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.use('/workspaces/:workspaceid', jobs);

module.exports = api;
