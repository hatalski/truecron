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

/**
 * Create a new task.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    if (!attributes || validator.isNull(attributes.name)) {
        throw new errors.InvalidParams();
    }
    attributes.updatedByPersonId = context.personId;
    var self = { attrs: attributes };

    return using (models.transaction(), function (tx) {

        self.tx = tx;
        return models.Task.create(self.attrs, { transaction: tx })
            .then(function (task) {
                self.task = task;

                return history.logCreated(context.personId, getTaskIdCacheKey(task.id), task, self.tx);
            })
            .then(function () {
                cache.put(getTaskIdCacheKey(self.task.id), self.task);
                return self.task;
            });
    })

        .catch(function (err) {
            logger.error('Failed to create a task, %s.', err.toString());
            throw err;
        });
});