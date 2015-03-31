'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common');

var api = express.Router();

/**
 * Format a workspace object retrieved from a database to be returned from the API.
 */
function formatWorkspace(workspace) {
    var ws = workspace.toJSON();
    var selfUri = '/workspaces/' + ws.id;
    ws.links = {
        self:       selfUri,
        jobs:       selfUri + '/jobs',
        history:    selfUri + '/history'
    };
    common.formatApiOutput(ws);
    return ws;
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
        var orgId = req.organization ? req.organization.id : req.query.organizationId;
        if (!orgId) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        var where = { organizationId: orgId };
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
                workspaces: result.rows.map(formatWorkspace),
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
    // Add a new workspace to the req.organization or req.body.workspace.organizationId.
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.workspace) {
            return next(new apiErrors.InvalidParams('workspace is not specified.'));
        }
        var organizationId = req.organization ? req.organization.id : req.body.workspace.organizationId;
        if (!organizationId) {
            return next(new apiErrors.InvalidParams('organizationId is not specified.'));
        }
        req.checkBody('workspace.name', 'Invalid workspace name.').isLength(1, 255);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        req.body.workspace.organizationId = organizationId;
        storage.Workspace.create(req.context, req.body.workspace)
            .then(function (workspace) {
                res.status(201).json({ workspace: formatWorkspace(workspace)});
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
        res.json({ workspace: formatWorkspace(req.workspace) });
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
                res.json({ workspace: formatWorkspace(workspace)});
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

function formatMember(member) {
    // TODO: Include person name/email
    var result = {
        userId: member.personId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        updatedByUserId: member.updatedByPersonId,
        links: {
            self: '/workspaces/' + member.workspaceId + '/members/' + member.personId,
            user: '/users/' + member.personId
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
                members: result.rows.map(formatMember),
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
                res.status(201).json(formatMember(member));
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
                res.json(formatMember(member));
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

api.use('/workspaces/:workspaceid', require('./jobs'));
api.use('/workspaces/:workspaceid', require('./history'));

module.exports = api;