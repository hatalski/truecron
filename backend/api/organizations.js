var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

/**
 * Format an organization object retrieved from a database to be returned from the API.
 */
function addLinks(organization) {
    if (organization === undefined) {
        return organization;
    }
    var org = organization.toJSON();
    var selfUrl = '/organizations/' + org.id;
    org._links = {
        self: selfUrl,
        users: selfUrl + '/users',
        workspaces: selfUrl + '/workspaces',
        history: selfUrl + '/history'
    };
    return { organization: org };
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
                organizations: result.rows.map(addLinks),
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
                res.status(201).json(addLinks(org));
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
        res.json(addLinks(req.organization));
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
                res.json(addLinks(org));
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

module.exports = api;