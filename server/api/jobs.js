var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
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

        var fnResult = function(i, result)
        {
            if(i >= result.rows.length - 1)
            {
                res.json({
                    jobs: result.rows.map(formatJob),
                    meta: {
                        total: result.count
                    }
                });
            }
        };

        storage.Jobs.findAndCountAll(req.context, req.workspace, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            for(var i = 0; i<result.rows.length; i++)
            {
                var job = result.rows[i];
                if (job.scheduleId) {
                    storage.Schedules.findById(req.context, job.scheduleId).then(function(schedule){
                        job.schedule = schedule;
                    }).then(function()
                    {
                        fnResult(i, result);
                    });
                }
                else {
                    job.schedule = null;
                    fnResult(i, result);
                }
            }

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
        storage.Workspace.findById(req.context, workspaceId)
            .then(function (workSpace){
                if(!workSpace){
                    res.status(400).json({});
                }
                req.body.job.organizationId = workSpace.organizationId;
                var organizationId = req.organization ? req.organization.id : req.body.job.organizationId;
                if (!organizationId) {
                    return next(new apiErrors.InvalidParams('Organization is not specified.'));
                }
                req.body.job.organizationId = organizationId;
                req.body.job.workspaceId = workspaceId;

                var fnCreateJob = function(context, job)
                {
                    storage.Jobs.create(context, job)
                        .then(function (job) {
                            res.status(201).json({ job: formatJob(job) });
                        })
                        .catch(function (err) {
                            logger.error(err.toString());
                            return next(err);
                        });
                };

                if(req.body.job.schedule)
                {
                    storage.Schedules.create(req.context, req.body.job.schedule)
                        .then(function(schedule)
                        {
                            req.body.job.scheduleId = schedule.id;
                            fnCreateJob(req.context, req.body.job);
                        })
                        .catch(function (err) {
                            logger.error(err.toString());
                            return next(err);
                        });
                }
                else
                {
                    fnCreateJob(req.context, req.body.job);
                }
            })
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

        var fnUpdateJob = function(context, id, job, schedule)
        {
            storage.Jobs.update(context, id, job)
                .then(function (updatedJob) {
                    if(schedule) {
                        updatedJob.schedule = schedule;
                    }
                    res.json({ job: formatJob(updatedJob) });
                });
        };

        if(req.body.job.schedule)
        {
            if(req.body.job.scheduleId) {
                storage.Schedules.update(req.context, req.body.job.scheduleId, req.body.job.schedule)
                    .then(function (schedule) {
                        fnUpdateJob(req.context, req.job.id, req.body.job, schedule);
                    });
            }
            else
            {
                storage.Schedules.create(req.context, req.body.job.schedule)
                    .then(function (schedule) {
                        req.job.scheduleId = schedule.id;
                        fnUpdateJob(req.context, req.job.id, req.body.job, schedule);
                    });
            }
        }
        else {
            fnUpdateJob(req.context, req.job.id, req.body.job);
        }
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        var fnResponse = function()
        {
            res.status(204).json({});
        };
        storage.Jobs.remove(req.context, req.job.id)
            .then(function()
            {
                fnResponse();
                //if(req.job.scheduleId) {
                //    storage.Schedules.remove(req.context, req.job.scheduleId)
                //        .then(fnResponse);
                //}
                //else {
                //    fnResponse();
                //}
            });
    });

api.use('/jobs/:jobid', require('./tasks'));
api.use('/jobs/:jobid', require('./runs'));
api.use('/jobs/:connectionid', require('./history'));
api.use('/jobs', require('./history'));

module.exports = api;