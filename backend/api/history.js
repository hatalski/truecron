'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

/**
 * Format a history record retrieved from a database to be returned from the API.
 */
function formatRecord(historyRecord) {
    var record = historyRecord.toJSON();
    var selfUrl = '/history/' + record.id;
    record.links = {
        self:   selfUrl
    };
    common.formatApiOutput(record);
    return record;
}

api.route('/history')
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (req.organization) {
            where.organizationId = req.organization.id;
        }
        if (req.workspace) {
            where.workspaceId = req.workspace.id;
        }
        if (req.person) {
            where.personId = req.person.id;
        }
        if (req.connection) {
            where.connectionId = req.connection.id;
        }
        if (req.job) {
            where.jobId = req.job.id;
        }
        if (req.task) {
            where.taskId = req.task.id;
        }

        if (Object.keys(where).length === 0) {
            return next(new apiErrors.InvalidParams('Cannot show history, object is not specified.'));
        }


        if (!req.organization) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        if (req.listParams.searchTerm) {
            where = _.merge(where, { change: { like: req.listParams.searchTerm } });
        }
        var order = '';
        if (req.listParams.sort) {
            order = req.listParams.sort + ' ' + req.listParams.direction;
        } else {
            order = 'createdAt desc';
        }
        var sort = req.listParams.sort || 'createdAt';

        storage.History.findAndCountAll(req.context, {
            where: where,
            order: order,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                records: result.rows.map(formatRecord),
                meta: {
                    total: result.count
                }});
        })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.param('recordid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid history record ID.'));
    }
    storage.History.findById(req.context, id)
        .then(function (record) {
            if (record !== null) {
                req.record = record;
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
        res.json({ record: formatRecord(req.record) });
    });

module.exports = api;

