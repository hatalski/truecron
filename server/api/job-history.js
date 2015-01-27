var express = require('express'),
    _ = require('lodash'),
    logger = require('./logger'),
    validator = require('./validator'),
    storage = require('../storage'),
    apiErrors = require('././errors'),
    common = require('./common');

var api = express.Router();

api.route('/')
    //
    // List of job's history
    //
    .get(common.parseListParams, function (req, res, next) {
        res.status(200).json({
            'job-histories': [
                {
                    id: 1,
                    description: "added 'copy files to FTP' task test",
                    updatedAt: new Date('2014-09-19T00:00:00.000Z'),
                    updatedBy: -10,
                    job: 1
                },
                {
                    id: 2,
                    description: "added 'send notification' task",
                    updatedAt: new Date('2014-09-19T00:00:00.000Z'),
                    updatedBy: -10,
                    job: 1
                },
                {
                    id: 3,
                    description: "updated 'copy files to FTP' task",
                    updatedAt: new Date('2014-09-19T00:00:00.000Z'),
                    updatedBy: -10,
                    job: 1
                }
            ]
        });
    });

module.exports = api;