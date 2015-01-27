var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common');

var api = express.Router();

var allTypes = [{
        id: -1, name: 'empty'
    },{
        id: 1, name: 'file'
    },{
        id: 2, name: 'execute'
    },{
        id: 3, name: 'archive'
    },{
        id: 4, name: 'sftp'
    },{
        id: 5, name: 'smtp'
    },{
        id: 6, name: 'http'
    }
];

api.route('/taskTypes')
    //
    // List of task types
    //
    .get(common.parseListParams, function (req, res, next) {
        res.status(200).json({
            'task-types': allTypes
        });
    });

api.param('taskTypeId', function (req, res, next, id) {

    var typeId = null;

    if (validator.isInt(id)) {
        typeId = id;
    }
    else {
        return next(new apiErrors.InvalidParams());
    }

    allTypes.forEach(function(index, type) {
        console.log(index);
        console.log(type);
        if (type.id === typeId) {
            req.taskType = type;
            next();
        }
    });
});

api.route('/taskTypes/:taskTypeId')
    .get(function (req, res, next) {
        res.json({ 'task-type': req.taskType });
    });

module.exports = api;