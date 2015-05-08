"use strict";

var express = require('express'),
//    expressWinston = require('express-winston'),
    errorhandler = require('errorhandler'),
    url = require('url'),
    util = require('util'),
    Promise = require("bluebird"),
    parseurl = require('parseurl'),
    logger = require('../lib/logger'),
    config = require('../lib/config'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common'),
    oauth = require('./../oauth');

var api = express.Router();

//
// Authenticate all API requests.
// Successful authentication will set req.clientId and req.personId fields.
// Unsuccessful will fail with 401 error.
api.use(oauth.authenticate);

//
// Routes
//
api.use(require('./users'));
api.use(require('./organizations'));
api.use(require('./workspaces'));
api.use(require('./jobs'));
api.use(require('./tasks'));
api.use(require('./connections'));
api.use(require('./task-types'));
api.use(require('./runs'));
api.use(require('./history'));
//api.use(require('./resetpassword'));
api.use(require('./payments'));

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
//        res."send({"
//                status: err.status,
//                message: err.message,
//                errors: [ err ]
//            });
//    });
//}


api.use(function(err, req, res, next) {
    logger.error(util.inspect(err) + " " + err.stack);
    // Make sure the err has an appropriate status and a message
    err = apiErrors.normalizeError(err);
    res.status(err.status);
    res.json({
        error: {
            status: err.status,
            message: err.message
        }
    });
});

module.exports = api;