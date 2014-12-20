var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

api.route('/taskTypes')
    //
    // List of task types
    //
    .get(common.parseListParams, function (req, res, next) {
        res.status(200).json({
            'task-types': [
                {
                    id: 1,
                    name: 'file'
                },
                {
                    id: -100,
                    name: 'execute'
                },
                {
                    id: 3,
                    name: 'archive'
                },
                {
                    id: 4,
                    name: 'sftp'
                },
                {
                    id: 5,
                    name: 'smtp'
                },
                {
                    id: 6,
                    name: 'http'
                },
                {
                    id: 7,
                    name: 'empty'
                }
            ]
        });
    });

module.exports = api;