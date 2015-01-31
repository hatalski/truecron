var Promise = require("bluebird"),
    _ = require('lodash'),
    util = require('util'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools'),
    jobs = require('./jobs');

var using = Promise.using;

//
//  for cache
//
var getTaskIdCacheKey = function(taskId) {
    return 'task/' + taskId;
};

var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    if (!attributes.organizationId) {
        throw new errors.InvalidParams('Organization ID is not specified.');
    }
    if (!attributes.workspaceId) {
        throw new errors.InvalidParams('Workspace ID is not specified.');
    }
    if (!attributes.jobId) {
        throw new errors.InvalidParams('Job ID is not specified.');
    }
    if (!attributes.name) {
        throw new errors.InvalidParams('Task name is not specified.');
    }
    if (!attributes.position) {
        throw new errors.InvalidParams('Task position is not specified.');
    }
    if (!attributes.taskTypeId) {
        throw new errors.InvalidParams('Task type is not specified.');
    }
    if (!attributes.settings) {
        throw new errors.InvalidParams('Task settings are not specified.');
    }
    if (!attributes.timeout) {
        throw new errors.InvalidParams('Task timeout is not specified.');
    }

    var locals = { attrs: attributes };
    attributes.timeout = attributes.timeout.toString();
    return using(models.transaction(), function (tx) {
        return jobs.ensureCanEdit(context, attributes.jobId)
            .then(function() {
                return models.Task.create(attributes, { transaction: tx });
            })
            .then(function (task) {
                locals.task = task;
                return Promise.join(
                    history.logCreated(context.personId, {
                            organizationId: task.organizationId,
                            workspaceId: task.workspaceId,
                            jobId: task.jobId,
                            taskId: task.id
                        }, task, tx),
                    cache.put(getTaskIdCacheKey(task.id), task),
                    function () {
                        return locals.task;
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed create task. %s.', err.toString());
        throw err;
    });
});

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, job, options) {
    var jobId = typeof job === 'object' ? tools.getId(job) : job;
    return jobs.ensureCanView(context, job)
        .then(function () {
            options = _.merge(options || {}, { where: { jobId: jobId } });
            return models.Task.findAndCountAll(options);
        })
        .then(function (result) {
            result.rows.forEach(function(task) { cache.put(getTaskIdCacheKey(task.id), task); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list tasks, %s.', err.toString());
            throw err;
        });
});

var findByIdNoCheck = module.exports.findByIdNoCheck = Promise.method(function (context, id, transaction) {
    return cache.get(getTaskIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Task.find({ where: { id: id } }, { transaction: transaction })
                .then(function (task) {
                    cache.put(getTaskIdCacheKey(id), task);
                    return task;
                });
        });
});

//
// Search for a single task by ID.
//
var findById = module.exports.findById = Promise.method(function (context, id, transaction) {
    var locals = {};
    return findByIdNoCheck(context, id, transaction)
        .then(function (task) {
            if (task === null) {
                return null;
            }
            locals.task = task;
            return jobs.ensureCanView(context, task.jobId)
                .then(function () {
                    return locals.task;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a task by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Update a task.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return findByIdNoCheck(context, id, tx)
            .then(function (task) {
                if (task === null) {
                    throw new errors.NotFound();
                }
                locals.oldTask = task;
                return jobs.ensureCanEdit(context, task.jobId);
            })
            .then(function () {
                return locals.oldTask.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function (task) {
                locals.task = task;
                return Promise.join(
                    history.logUpdated(context.personId, {
                            organizationId: task.organizationId,
                            workspaceId: task.workspaceId,
                            jobId: task.jobId,
                            taskId: task.id
                        }, task, locals.oldTask, tx),
                    cache.put(getTaskIdCacheKey(locals.task.id), locals.task),
                    function () {
                        return locals.task;
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to update the task %d, %s.', id, err.toString());
        throw err;
    });
});

/**
 * Remove a task.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { };
        return findByIdNoCheck(context, id, tx)
            .then(function (task) {
                if (task === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.task = task;
                return jobs.ensureCanEdit(context, task.jobId)
                    .then(function () {
                        return locals.task.destroy({transaction: tx});
                    })
                    .then(function () {
                        return Promise.join(
                            history.logRemoved(context.personId, {
                                    organizationId: locals.task.organizationId,
                                    workspaceId: locals.task.workspaceId,
                                    jobId: locals.task.jobId,
                                    taskId: locals.task.id
                                }, locals.task, tx),
                            cache.remove(getTaskIdCacheKey(locals.task.id)));
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to remove the task %d, %s.', id, err.toString());
        throw err;
    });
});
