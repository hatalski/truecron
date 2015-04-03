'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common');

var api = express.Router();

//
//add links
//
function formatTask(task) {
    var tk = task.toJSON();
    var selfUrl = '/tasks/' + task.id;
    tk.links = {
        self: selfUrl
    };
    common.formatApiOutput(tk);
    return tk;
}
api.route('/tasks')
    //
    // Get all tasks
    //
    .get(common.parseListParams, function (req, res, next) {
        if (!req.job) {
            return next(new apiErrors.InvalidParams('Job is not specified.'));
        }
        var where = {};
        if (req.listParams.searchTerm) {
            where = { name: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'name';

        storage.Tasks.findAndCountAll(req.context, req.job, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                tasks: result.rows.map(formatTask),
                meta: {
                    total: result.count
                }});
        });
    })
    //
    // Add a new task
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.task) {
            return next(new apiErrors.InvalidParams('Task is not specified.'));
        }
        var jobId = req.job ? req.job.id : req.body.task.jobId;
        if (!jobId) {
            return next(new apiErrors.InvalidParams('jobId is not specified.'));
        }
        //get job
        storage.Jobs.findById(req.context, jobId)
            .then(function(job){
                req.body.task.workspaceId = job.workspaceId;
                req.body.task.organizationId = job.organizationId;

                var workspaceId = req.workspace ? req.workspace.id : req.body.task.workspaceId;
                if (!workspaceId) {
                    workspaceId = jobBody.workspaceId;
                }
                if (!workspaceId) {
                    return next(new apiErrors.InvalidParams('workspaceId is not specified.'));
                }
                var organizationId = req.organization ? req.organization.id : req.body.task.organizationId;
                if (!organizationId) {
                    organizationId = jobBody.organizationId;
                }
                if (!organizationId) {
                    return next(new apiErrors.InvalidParams('organizationId is not specified.'));
                }
                req.body.task.organizationId = organizationId;
                req.body.task.workspaceId = workspaceId;
                req.body.task.jobId = jobId;
                storage.Tasks.create(req.context, req.body.task)
                    .then(function (task) {
                        res.status(201).json({task: formatTask(task)});
                    })
                    .catch(function (err) {
                        logger.error(err.toString());
                        next(err);
                    });
            });
    });

api.param('taskId', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid task ID.'));
    }

    storage.Tasks.findById(req.context, id)
        .then(function (task) {
            if (task !== null) {
                req.task = task;
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


api.route('/tasks/:taskId')

//
// Get task by id
//
    .get(common.parseListParams, function (req, res, next) {
        res.json({task: formatTask(req.task)});
    })

    //
    // Update a task
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.task) {
            return next(new apiErrors.InvalidParams('Task is not specified.'));
        }
        storage.Tasks.update(req.context, req.task.id, req.body.task)
            .then(function (task) {
                res.json({task: formatTask(task)});
            });
    })
    //
    // Delete a task
    //
    .delete(function (req, res, next) {
        storage.Tasks.remove(req.context, req.task.id)
            .then(function () {
                res.status(204).json({});
            });
    });

api.use('/tasks/:taskId', require('./history'));

module.exports = api;