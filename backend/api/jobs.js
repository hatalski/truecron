var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

function formatJob(req, datajob) {
    if (datajob === undefined) {
        return datajob;
    }
    var job = datajob.toJSON();
    var selfUrl = req.url.indexOf(job.id) >= 0 ? req.url : req.url + '/' + job.id;
    job.links = {
        self:    selfUrl,
        tasks:   selfUrl + '/tasks',
        history: selfUrl + '/history'
    };
    common.formatApiOutput(job);
    return job;
}

api.route('/jobs')
    //
    // List of jobs
    //
    .get(common.parseListParams, function (req, res, next) {
        if (!req.workspace) {
            return next(new apiErrors.InvalidParams('Workspace is not specified.'));
        }
        var where = { };
        if (req.listParams.searchTerm) {
            where = _.merge(where, { name: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'name';

        storage.Jobs.findAndCountAll(req.context, req.workspace, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                jobs: result.rows.map(formatJob.bind(null, req)),
                meta: {
                    total: result.count
                }});
        });
    })

    //
    // Create a new job
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.job) {
            return next(new apiErrors.InvalidParams('job is not specified.'));
        }
        var workspaceId = req.workspace ? req.workspace.id : req.body.job.workspaceId;
        if (!workspaceId) {
            return next(new apiErrors.InvalidParams('Workspace is not specified.'));
        }
        req.context.url = req.url;
        req.body.job.workspaceId = workspaceId;
        storage.Jobs.create(req.context, req.body.job)
            .then(function (job) {
                res.status(201).json({ job: formatJob(req, job) });
            })
            .catch(function (err) {
                logger.error(err.toString());
                return next(err);
            });
    });

//
// Params
//

api.param('jobid', function (req, res, next, id) {

    var jobid = null;

    if (validator.isInt(id)) {
        jobid = id;
    }
    else {
        return next(new apiErrors.InvalidParams());
    }

    storage.Jobs.findById(req.context, id)
        .then(function (job) {
            if (job) {
                req.job = job;
                req.context.links.jobId = job.id;
                next();
            } else {
                next(new apiErrors.NotFound());
            }
        });
});

api.route('/jobs/:jobid')
    //
    // Get a job
    //
    .get(function (req, res, next) {
        res.json(formatJob(req, req.job));
    })
    //
    // Update a job
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.job) {
            return next(new apiErrors.InvalidParams());
        }
        req.context.url = req.url;
        storage.Jobs.update(req.context, req.job.id, req.body.job)
            .then(function (job) {
                res.json({ job: formatJob(req, job) });
            });
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        req.context.url = req.url;
        storage.Jobs.remove(req.context, req.job.id)
            .then(function () {
                res.status(204).json({});
            });
    });

api.use('/jobs/:jobid', require('./tasks'));
api.use('/jobs/:jobid/history', require('./job-history'));

module.exports = api;