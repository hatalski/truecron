/**
 * Created by Andrew on 29.10.2014.
 */
var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();
var jobId = null;

function addLinks(datatask) {
    if (datatask === undefined) {
        return datatask;
    }
    var task = datatask.toJSON();
    var selfUrl = '/jobs/'+jobId+'/tasks/' + task.id;
    task._links = {
        self: selfUrl
    };
    return { task: task };
}

api.param('jobid', function (req, res, next, id) {

    if (!validator.isInt(id)) {
        return next(new apierrors.invalidparams('Invalid job ID.'));
    }
    storage.Tasks.findAllTasks(req.context, id)
        .then(function (task) {
            if (task !== null) {
                req.Tasks = task;
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

api.route('/jobs/:jobid/tasks')
    //
    // Get tasks
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { role: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'updatedAt';

        storage.Organization.getAccessList(req.context, req.organization.id, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                tasks: result.rows.map(addLinks),
                meta: {
                    total: result.count
                }});
        })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })

module.exports = api;