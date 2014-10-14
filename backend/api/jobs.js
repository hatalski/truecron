var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    config = require('../lib/config'),
    common = require('./common');

var api = express.Router();

api.route(common.parseListParams, '/workspaces/:org_id/:workspace_id')
    .get('/jobs', function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { name: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'name';

        storage.Job.findAndCountAll({
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
            res.json({
                users: result.rows.map(personToUser),
                meta: {
                    total: result.count
                }});
        });
    });

module.exports = router;
