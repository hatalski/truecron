var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

function jobAddLink(job) {
    if (job === undefined) {
        return job;
    }
    var jobs = job.toJSON();
    var selfUrl = '/jobs/' + jobs.id;
    jobs._links = {
        self: selfUrl,
        tasks: selfUrl + '/tasks',
        history: selfUrl + '/history',
        results: selfUrl + '/results'
    };
    return { jobs: jobs };
}


api.route('/jobs')
    //
    // List of jobs
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { name: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'name';

        storage.Jobs.findAndCountAll({
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                jobs: result.rows.map(jobAddLink),
                meta: {
                    total: result.count
                }});
        });
    })

    .post(function (req, res, next) {
        if (!req.body || !req.body.user) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.create(req.body.user)
            .then(function (job) {
                res.status(201).json(jobAddLink(job));
            })
            .catch(function (err) {
                logger.error(err);
                return next(new apiErrors.InvalidParams(err));
            });
    });

//
// :userid can be specified as an integer ID or an email.
//
api.param('jobsid', function (req, res, next, id) {

    var jobsId = null;
    if (validator.isInt(id)) {
        jobsId = id;
    }
    else {
        next(new apiErrors.InvalidParams());
    }

    if (!!jobsId) {
        storage.jobs.findById(id)
            .then(function (jobs) {
                if (jobs !== null) {
                    req.jobs = jobs;
                    next();
                } else {
                    next(new apiErrors.NotFound());
                }
            });
    }
});

api.route('/jobs/:jobsid')
    //
    // Get a job
    //
    .get(function (req, res, next) {
        res.json(jobAddLink(req.jobs));
    })
    //
    // Update a jobs
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.jobs) {
            return next(new apiErrors.InvalidParams());
        }
        storage.jobs.update(req.jobs.id, req.body.jobs)
            .then(function (jobs) {
                res.json(jobAddLink(jobs));
            });
    })
    //
    // Delete a jobs
    //
    .delete(function (req, res, next) {
        storage.jobs.remove(req.jobs.id)
            .then(function () {
                res.status(204).json({});
            });
    });




module.exports = api;
