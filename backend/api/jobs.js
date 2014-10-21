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
    return { job: jobs };
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
        if (!req.body || !req.body.job) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Jobs.create(req.body.job)
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
    // Allow to specify both ID and email
    var jobsId = null;
    var email = null;
    if (validator.isInt(id)) {
        jobsId = id;
    } else if (validator.isEmail(id)) {
        email = id;
    } else {
        next(new apiErrors.InvalidParams());
    }

    if (!!jobsId) {
        storage.Jobs.findById(id)
            .then(function (job) {
                if (job !== null) {
                    req.job = job;
                    next();
                } else {
                    next(new apiErrors.NotFound());
                }
            });
    } else {
        console.log('Error. This is email.');
        storage.Jobs.findByEmail(email)
            .then(function (person) {
                if (person !== null) {
                    req.Person = person;
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
        storage.Jobs.update(req.jobs.id, req.body.jobs)
            .then(function (jobs) {
                res.json(jobAddLink(jobs));
            });
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        storage.Jobs.remove(req.job.id)
            .then(function () {
                res.status(204).json({});
            });
    });




module.exports = api;
