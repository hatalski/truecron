var Promise = require("bluebird"),
    _ = require('lodash'),
    mongoose = require('mongoose'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools');

var Job = mongoose.model('Job');

var findAndCountAll = module.exports.findAndCountAll =
    Promise.method(function (context, workspace, options) {
        // validate user has access
        return Job.find().exec();
});