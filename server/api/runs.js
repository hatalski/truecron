/**
 * Created by Andrew on 26.11.2014.
 */
//'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common'),
    JobRunner = require('../worker/jobRunner'),
    SocketLogger = require('../worker/loggers/socketLog');

var api = express.Router();

//
//add links
//
function formatRun(run) {
    var rn = run.toJSON();
    var selfUrl = '/runs/' + run.id;
    rn._links = {
        self: selfUrl,
        job: '/job/' + run.jobId
    };
    return rn;
}

api.route('/runs')
    //
    // Get all runs of a specific job
    //
    .get(common.parseListParams, function (req, res, next) {
        if (!req.job) {
            return next(new apiErrors.InvalidParams('Job is not specified.'));
        }
        var where = { jobId: req.job.id };
        if (req.listParams.searchTerm) {
            where = _.merge(where, { message: { like: req.listParams.searchTerm } });
        }
        var sort = req.listParams.sort || 'elapsed';

        storage.Runs.findAndCountAll(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                runs: result.rows.map(formatRun),
                meta: {
                    total: result.count
                }});
        });
    })

/* not use for api?????????*/
    //
    // Create a new run
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.run) {
            return next(new apiErrors.InvalidParams());
        }
        var organizationId = req.organization ? req.organization.id : req.body.run.organizationId;
        if (!organizationId) {
            return next(new apiErrors.InvalidParams('Organization is not specified.'));
        }
        var workspaceId = req.workspace ? req.workspace.id : req.body.run.workspaceId;
        if (!workspaceId) {
            return next(new apiErrors.InvalidParams('Workspace is not specified.'));
        }
        var jobId = req.workspace ? req.workspace.id : req.body.run.jobId;
        if (!jobId) {
            return next(new apiErrors.InvalidParams('Job is not specified.'));
        }
        req.body.run.organizationId = organizationId;
        req.body.run.workspaceId = workspaceId;
        req.body.run.jobId = jobId;
        storage.Runs.create(req.context, req.body.run)
            .then(function (run) {
                storage.Tasks.findAndCountAll(req.context, run.get('jobId')).then(function (tasks) {
                    var socketLogger = new SocketLogger(req.body.run.guid);
                    var jobRunner = new JobRunner({tasks: tasks}, socketLogger);
                    jobRunner.run();
                    res.status(201).json({run: formatRun(run)});
                })
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });


api.param('runid', function (req, res, next, id) {
    if (!validator.isInt(id)) {
        return next(new apiErrors.InvalidParams('Invalid run ID.'));
    }

    storage.Runs.findById(req.context, id)
        .then(function (run) {
            if (run !== null) {
                req.run = run;
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


api.route('/runs/:runid')

//
// Get run by id
//
    .get(common.parseListParams, function (req, res, next) {
        res.json({ run: formatRun(req.run)});
    });
/* not use for api
    //
    // Update a run
    //

    .put(function (req, res, next) {
        if (!req.body || !req.body.run) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Runs.update(req.context, req.params.jobid, req.params.runid, req.body.run)
            .then(function (run) {
                res.json({ run: formatRun(run) });
            });
    })

//
// Delete a run
//
    .delete(function (req, res, next) {
        storage.Runs.remove(req.context, req.params.jobid, req.params.runid)
            .then(function () {
                res.status(204).json({});
            });
    });
*/
module.exports = api;
