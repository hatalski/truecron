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

module.exports = api;