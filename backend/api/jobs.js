var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

function addLinks(datajob) {
    if (datajob === undefined) {
        return datajob;
    }
    var job = datajob.toJSON();
    var selfUrl = '/jobs/' + job.id;
    job._links = {
        self: selfUrl
    };
    return { job: job };
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
                jobs: result.rows.map(addLinks),
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
            return next(new apiErrors.InvalidParams());
        }
        storage.Jobs.create(req.body.job)
            .then(function (job) {
                res.status(201).json(addLinks(job));
            })
            .catch(function (err) {
                logger.error(err.toString());
                return next(new apiErrors.InvalidParams(err));
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
        next(new apiErrors.InvalidParams());
    }

    if (!!jobid) {
        storage.Jobs.findById(id)
            .then(function (job) {
                if (job !== null) {
                    req.Jobs = job;
                    next();
                } else {
                    next(new apiErrors.NotFound());
                }
            });
    }
});

api.route('/jobs/:jobid')
    //
    // Get a job
    //
    .get(function (req, res, next) {
        res.json(addLinks(req.Jobs));
    })
    //
    // Update a job
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.job) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Jobs.update(req.Jobs.id, req.body.job)
            .then(function (job) {
                res.json(addLinks(job));
            });
    })
    //
    // Delete a job
    //
    .delete(function (req, res, next) {
        storage.Jobs.remove(req.Jobs.id)
            .then(function () {
                res.status(204).json({});
            });
    });



module.exports = api;