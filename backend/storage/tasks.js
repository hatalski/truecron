var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

var using = Promise.using;

//
//  for cache
//
var getTaskIdCacheKey = function(taskId) {
    return 'task/' + taskId;
};

var createTask = module.exports.createTask = Promise.method(function (context, jobId, attributes) {
    attributes.updatedByPersonId = context.personId;
    attributes.jobId = jobId;
    return using(models.transaction(), function (tx) {
            return models.Task.create(attributes, { transaction: tx });
    })
        .catch(function (err) {
            logger.error('Failed create task on the job %d .', jobId, err.toString());
            throw err;
        });
});

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

//
// Search for a single task by ID.
//
var findById = module.exports.findById = Promise.method(function (context, id, jobid, transaction) {
    return cache.get(getTaskIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Task.find({ where: { id: id, jobId: jobid } }, { transaction: transaction })
                .then(function (task) {
                    cache.put(getTaskIdCacheKey(id), task);
                    return task;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a task by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Remove a task.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var self = { tx: tx };
        return findById(context, id)
            .then(function (task) {
                if (task === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                self.task = task;
                return task.destroy({transaction: self.tx})
                    .then(function () {
                        return history.logRemoved(context.personId, getTaskIdCacheKey(self.task.id), self.task, self.tx);
                    })
                    .then(function () {
                        cache.remove(getTaskIdCacheKey(self.task.id))
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to remove the task %d, %s.', id, err.toString());
            throw err;
        });
});
