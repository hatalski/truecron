'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common'),
    workspaces = require('./workspaces');

var api = express.Router();

/**
 * Format an organization object retrieved from a database to be returned from the API.
 */
function formatOrganization(req, organization) {
    if (organization === undefined) {
        return organization;
    }
    var org = organization.toJSON();
    org.links = {
        self: req.context.links.organization(org.id),
        members: req.context.links.organizationMembers(org.id),
        workspaces: req.context.links.workspaces(org.id),
        history: req.context.links.organizationHistory(org.id)
    };
    delete org.secretHash;

    common.formatApiOutput(org);
    return org;
}

api.route('/organizations')
    //
    // List of organizations
    //
    .get(common.parseListParams, function (req, res, next) {

        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { name: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'name';

        storage.Organization.findAndCountAll(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                organizations: result.rows.map(formatOrganization.bind(null, req)),
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
    // Create a new organization
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.organization) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Organization.create(req.context, req.body.organization)
            .then(function (org) {
                res.status(201).json({ organization: formatOrganization(req, org) });
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('orgid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid organization ID.'));
    }
    storage.Organization.findById(req.context, id)
        .then(function (org) {
            if (org !== null) {
                req.organization = org;
                req.context.links.organizationId = org.id;
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

api.route('/organizations/:orgid')
    //
    // Get an organization
    //
    .get(function (req, res, next) {
        res.json({ organization: formatOrganization(req, req.organization) });
    })
    //
    // Update an organization
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.organization) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Organization.update(req.context, req.organization.id, req.body.organization)
            .then(function (org) {
                res.json({ organization: formatOrganization(req, org) });
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Delete an organization
    //
    .delete(function (req, res, next) {
        storage.Organization.remove(req.context, req.organization.id)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

//
// ORGANIZATION MEMBERS
//

function formatMember(req, member) {
    if (member === undefined) {
        return member;
    }
    // TODO: Include person name/email
    var result = {
        userId: member.personId,
        role: member.role,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
        updatedByUserId: member.updatedByPersonId,
        _links: {
            self: req.context.links.organizationMember(member.personId),
            user: req.context.links.user(member.personId)
        }
    };
    common.formatApiOutput(result);
    return { member: result };
}

api.route('/organizations/:orgid/members')
    //
    // List members with roles
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { role: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'updatedAt';

        storage.OrganizationAccess.getAccessList(req.context, req.organization.id, {
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
        req.checkBody('member.role', 'Invalid role value. Must be "admin" or "member".').isIn(['admin', 'member']);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        storage.OrganizationAccess.grantAccess(req.context, req.organization.id, req.body.member.userId, req.body.member.role)
            .then(function (member) {
                res.status(201).json(formatMember(req, member));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('memberid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid member ID.'));
    }
    req.memberId = +id;
    req.context.links.memberId = +id;
    next();
});

api.route('/organizations/:orgid/members/:memberid')
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
        req.checkBody('member.role', 'Invalid role value. Must be "admin" or "member".').isIn(['admin', 'member']);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        storage.OrganizationAccess.grantAccess(req.context, req.organization.id, req.memberId, req.body.member.role)
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
        storage.OrganizationAccess.revokeAccess(req.context, req.organization.id, req.memberId)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.use('/organizations/:orgid', workspaces);

module.exports = api;