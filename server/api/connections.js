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
 * Format a connection object retrieved from a database to be returned from the API.
 */
function formatConnection(connection) {
    var conn = connection.toJSON();
    var selfUrl = '/connections/' + conn.id;
    conn.links = {
        self:   selfUrl,
        history: selfUrl + '/history'
    };
    common.formatApiOutput(conn);
    return conn;
}

//
// Connections are designed to be mounted under organizations. I.e. req.organization is already set
// to an organization instance and current user has at least member privileges.
//
api.route('/connections')
    //
    // List connections of the req.organization.
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = { };
        if (req.organization) {
            where = { organizationId: req.organization.id };
        }
        if (req.listParams.searchTerm) {
            where = _.merge(where, { name: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'name';

        storage.Connection.findAndCountAll(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                connections: result.rows.map(formatConnection),
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
    // Add a new connection to the req.organization or req.body.connection.organizationId.
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.connection) {
            return next(new apiErrors.InvalidParams('Connection is not specified.'));
        }
        var organizationId = req.organization ? req.organization.id : req.body.connection.organizationId;
        if (!organizationId) {
            return next(new apiErrors.InvalidParams('organizationId is not specified.'));
        }
        req.checkBody('connection.name', 'Invalid connection name.').isLength(1, 255);
        var errors = req.validationErrors();
        if (errors) {
            return next(new apiErrors.InvalidParams(errors));
        }
        req.body.connection.organizationId = organizationId;
        storage.Connection.create(req.context, req.body.connection)
            .then(function (connection) {
                res.status(201).json({ connection: formatConnection(connection)});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('connectionid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid connection ID.'));
    }
    storage.Connection.findById(req.context, id)
        .then(function (connection) {
            if (connection) {
                req.connection = connection;
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

api.route('/connections/:connectionid')
    //
    // Get a connection
    //
    .get(function (req, res, next) {
        res.json({ connection: formatConnection(req.connection) });
    })
    //
    // Update the connection
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.connection) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Connection.update(req.context, req.connection.id, req.body.connection)
            .then(function (connection) {
                res.json({ connection: formatConnection(connection)});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Delete the connection
    //
    .delete(function (req, res, next) {
        storage.Connection.remove(req.context, req.connection.id)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.use('/connections/:connectionid', require('./history'));
api.use('/connections', require('./history'));

module.exports = api;
