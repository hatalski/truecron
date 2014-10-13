"use strict";

var express = require('express'),
//    expressWinston = require('express-winston'),
    errorhandler = require('errorhandler'),
    url = require('url'),
    Promise = require("bluebird"),
    parseurl = require('parseurl'),
    logger = require('../../lib/logger'),
    config = require('../../lib/config'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common'),
    authenticate = require('./authenticate');

var api = express.Router();

//
// Application-level authentication
//
api.use(authenticate);

//
// Routes
//
api.use(require('./users'));
//api.use(require('./organizations'));
//api.use(require('./workspaces'));


//
// Errors and logging
//

/// catch 404 and forward to error handler
api.use(function(req, res, next) {
    next(new apiErrors.NotFound());
});


//if (app.get('env') === 'development') {
//    api.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.send({
//                status: err.status,
//                message: err.message,
//                errors: [ err ]
//            });
//    });
//}


api.use(function(err, req, res, next) {
    var status = err.status;
    var message = err.message;
    // TODO: Move to 'errors', extract messages from inner exceptions
    if (!status) {
        // Check for errors caused by invalid arguments
        if (err.name === 'SequelizeUniqueConstraintError') {
            status = 400; // Uniqueness violation.
            message = message || 'Uniqueness violation';
        }
        if (err.name === 'SequelizeValidationError') {
            status = 400; // Invalid values.
            message = message || 'Invalid arguments';
        }
    }
    status = status || 500;
    res.status(status);
    res.json({
        error: {
            status: status,
            message: message
        }
    });
});

module.exports = api;