/**
 * Created by Andrew on 29.10.2014.
 */
var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();
var jobId = null;

function addLinks(datatask) {
    if (datatask === undefined) {
        return datatask;
    }
    var task = datatask.toJSON();
    var selfUrl = '/jobs/:jobid/tasks/' + task.id;
    task._links = {
        self: selfUrl
    };
    return { task: task };
}

api.param('jobid', function (req, res, next, id) {


    if (validator.isInt(id)) {
        jobid = id;
    }
    else {
        next(new apiErrors.InvalidParams());
    }

//    if (!!jobid) {
//        storage.Tasks.findAllTasksByJobId(req.context, id)
//            .then(function (task) {
//                if (task !== null) {
//                    req.Tasks = task;
//                    next();
//                } else {
//                    next(new apiErrors.NotFound());
//                }
//            });
//    }
});

api.route('/jobs/:jobid/tasks')

    .get(common.parseListParams, function (req, res, next) {

        var where = {jobId:jobId};

        var sort = req.listParams.sort || 'name';

        storage.Tasks.findAllTasksByJobId(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                tasks: result.rows.map(addLinks),
                meta: {
                    total: result.count
                }});
        });
    })

module.exports = api;