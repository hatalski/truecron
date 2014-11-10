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


module.exports = api;