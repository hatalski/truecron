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
                job: result.rows,
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
//only one job
api.route('/jobs/:jobsid')
    //
    // Get a job
    //
    .get(function (req, res, next) {
        res.json(jobAddLink(req.Jobs));
    })
    //
    // Update a job
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.user) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.update(req.Person.id, req.body.user)
            .then(function (jobs) {
                res.json(jobAddLink(jobs));
            });
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        storage.jobs.remove(req.Jobs.id)
            .then(function () {
                res.status(204).json({});
            });
    });

module.exports = api;
