var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

api.route('/connections')
    //
    // List of jobs
    //
    .get(common.parseListParams, function (req, res, next) {
        res.status(200).json({
            connections: [
                {
                    id: 1,
                    name: 'SFTP Connection',
                    settings: '{}',
                    createdAt: new Date('2014-09-19T00:00:00.000Z'),
                    updatedAt: new Date('2014-09-20T00:00:00.000Z'),
                    archived: false,
                    updatedBy: 1
                },
                {
                    id: 2,
                    name: 'SMTP Server',
                    settings: '{}',
                    createdAt: new Date('2014-09-20T00:00:00.000Z'),
                    updatedAt: new Date('2014-09-20T00:00:00.000Z'),
                    archived: true,
                    updatedBy: 1
                },
                {
                    id: 3,
                    name: 'Agent',
                    settings: '{}',
                    createdAt: new Date('2014-09-20T00:00:00.000Z'),
                    updatedAt: new Date('2014-09-20T00:00:00.000Z'),
                    archived: false,
                    updatedBy: 1
                }
            ]
        });
    })

    //
    // Create a new job
    //
    .post(function (req, res, next) {
        res.status(201).json({
            id: 4,
            name: 'Unnamed',
            settings: '{}',
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: false,
            updatedBy: 1
        });
    });

api.route('/connections/:connectionId')
    //
    // Get a connection
    //
    .get(function (req, res, next) {
        res.status(200).json({
            id: 1,
            name: 'SFTP Connection',
            settings: '{}',
            createdAt: new Date('2014-09-19T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: false,
            updatedBy: 1
        });
    })
    //
    // Update a connection
    //
    .put(function (req, res, next) {
        res.status(200).json({
            id: 2,
            name: 'SMTP Server',
            settings: '{}',
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: true,
            updatedBy: 1
        });
    })
    //
    // Delete a connection
    //
    .delete(function (req, res, next) {
        res.status(204).json({});
    });

module.exports = api;