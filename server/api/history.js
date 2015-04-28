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
        var withChildren = !!req.query.children;

        if (req.task) {
            where.taskId = req.task.id;
        } else if (req.job) {
            where.jobId = req.job.id;
            if (!withChildren) {
                where.taskId = null;
            }
        } else if (req.connection) {
            where.connectionId = req.connection.id;
        } else if (req.workspace) {
            where.workspaceId = req.workspace.id;
            if (!withChildren) {
                where.jobId = null;
                where.taskId = null;
            }
        } else if (req.organization) {
            where.organizationId = req.organization.id;
            if (!withChildren) {
                where.workspaceId = null;
                where.connectionId = null;
                where.jobId = null;
                where.taskId = null;
            }
        } else if (req.person) {
            where.personId = req.person.id;
        }

        var setFieldsCount = _.reduce(where, function (sum, value) { return value ? sum + 1 : sum; }, 0);
        if (setFieldsCount === 0) {
            return next(new apiErrors.InvalidParams('Cannot show history, object is not specified.'));
        }

        if (req.listParams.searchTerm) {
            where = _.merge(where, { change: { like: req.listParams.searchTerm } });
        }
        var order = '';
        if (req.listParams.sort) {
            order = req.listParams.sort + ' ' + req.listParams.direction;
        } else {
            order = '"createdAt" desc';
        }

        storage.History.findAndCountAll(req.context, {
            where: where,
            order: order,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                history: result.rows.map(formatRecord),
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

api.route('/history/:recordid')
    //
    // Get a history record
    //
    .get(function (req, res, next) {
        res.json({ history: formatRecord(req.record) });
    });

module.exports = api;

