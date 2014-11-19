'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

//
//add links
//
//+++++++++++++++++++++++++++++++
function formatTask(task) {
    if (task === undefined) {
        return task;
    }
    var tk = task.toJSON();
    var selfUrl = '/jobs/' + task.jobId + '/tasks/' + task.id;
    tk._links = {
        self: selfUrl
    };
    return {task:tk};
}
//+++++++++++++++++++++++
api.route('/jobs/:jobid/tasks')
    //
    // Get all tasks
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { jobId: req.params.jobid };
        }
        var sort = req.listParams.sort || 'name';

        storage.Tasks.findAndCountAll(req.context, {
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
            return next(new apiErrors.InvalidParams());
        }
        storage.Tasks.createTask(req.context, req.params.jobid, req.body.task)
            .then(function (task) {
                res.status(201).json(formatTask(task));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.route('/jobs/:jobid/tasks/:taskid')

//
// Get task by id
//
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { jobId: req.params.jobid , id:req.params.id};
        }
        var sort = req.listParams.sort || 'name';

        storage.Tasks.findById(req.context, req.params.taskid, req.params.jobid).then(function (task) {
            res.json(formatTask(task));
        });
    });

module.exports = api;