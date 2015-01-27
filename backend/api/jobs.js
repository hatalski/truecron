var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

function formatJob(datajob) {
    var job = datajob.toJSON();
    var selfUrl = '/jobs/' + job.id;
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
                jobs: result.rows.map(formatJob),
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
        var organizationId = req.organization ? req.organization.id : req.body.job.organizationId;
        if (!organizationId) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        var workspaceId = req.workspace ? req.workspace.id : req.body.job.workspaceId;
        if (!workspaceId) {
            return next(new apiErrors.InvalidParams('Workspace is not specified.'));
        }
        req.body.job.organizationId = organizationId;
        req.body.job.workspaceId = workspaceId;
        storage.Jobs.create(req.context, req.body.job)
            .then(function (job) {
                res.status(201).json({ job: formatJob(job) });
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
    } else {
        return next(new apiErrors.InvalidParams());
    }

    storage.Jobs.findById(req.context, id)
        .then(function (job) {
            if (job) {
                req.job = job;
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
        res.json({ job: formatJob(req.job) });
    })
    //
    // Update a job
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.job) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Jobs.update(req.context, req.job.id, req.body.job)
            .then(function (job) {
                res.json({ job: formatJob(job) });
            });
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        storage.Jobs.remove(req.context, req.job.id)
            .then(function () {
                res.status(204).json({});
            });
    });

api.use('/jobs/:jobid', require('./tasks'));
api.use('/jobs/:jobid', require('./runs'));
api.use('/jobs/:connectionid', require('./history'));
api.use('/jobs', require('./history'));

module.exports = api;