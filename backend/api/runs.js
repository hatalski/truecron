/**
 * Created by Andrew on 26.11.2014.
 */
//'use strict';

var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

//
//add links
//
function formatRun(run) {
    if (run === undefined) {
        return run;
    }
    var rn = run.toJSON();
    var selfUrl = '/jobs/' + run.jobId + '/runs/' + run.id;
    rn._links = {
        self: selfUrl
    };
    return {run:rn};}

api.route('/jobs/:jobid/runs')
    //
    // Get all runs
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { jobId: req.params.jobid };
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
    //
    // Create a new run
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.run) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Runs.create(req.context, req.params.jobid, req.body.run)
            .then(function (run) {
                res.status(201).json(formatRun(run));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

api.route('/jobs/:jobid/runs/:runid')

//
// Get run by id
//
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { jobId: req.params.jobid , id:req.params.runid};
        }
        var sort = req.listParams.sort || 'elapsed';

        storage.Runs.findById(req.context, req.params.runid, req.params.jobid).then(function (run) {
            res.json(formatRun(run));
        });
    })

    //
    // Update a run
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.run) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Runs.update(req.context, req.params.runid, req.params.jobid, req.body.run)
            .then(function (run) {
                res.json(formatRun(run));
            });
    })

//
// Delete a run
//
    .delete(function (req, res, next) {
        storage.Runs.remove(req.context, req.params.runid)
            .then(function () {
                res.status(204).json({});
            });
    });

module.exports = api;
