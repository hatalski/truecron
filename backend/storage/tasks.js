/**
 * Created by Andrew on 29.10.2014.
 */
var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    secrets = require('../../lib/secrets'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

var using = Promise.using;

/**
 * For cache.
 */
var getTaskIdCacheKey = function(taskId) {
    return 'task/' + taskId;
};

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return models.Task.findAndCountAll(options)
        .then(function (result) {
            result.rows.forEach(function(task) { cache.put(getTaskIdCacheKey(task.id), task); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list tasks, %s.', err.toString());
            throw err;
        });
});