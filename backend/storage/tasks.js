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

var findAllTasks = module.exports.findAllTasks = Promise.method(function (context, id, transaction) {
    var locals = { cacheKey: getTaskIdCacheKey(id) };
    return cache.get(locals.cacheKey)
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Task.find({ where: { jobId: id } }, { transaction: transaction })
                .then(function (tasks) {
                    cache.put(locals.cacheKey, tasks);
                    return tasks;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find tasks %s, %s.', id, err.toString());
            throw err;
        });
});