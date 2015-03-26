/**
 * Created by Andrew on 22.10.2014.
 */

var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools'),
    workspaceAccess = require('./workspace-access');

var using = Promise.using;

/**
 * For cache.
 */
var getJobIdCacheKey = function(jobId) {
    return 'job/' + jobId;
};

//
// Jobs
//

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, workspace, options) {
    return workspaceAccess.ensureHasAccess(context, tools.getId(workspace), workspaceAccess.WorkspaceRoles.Viewer)
        .then(function () {
            options = _.merge(options || {}, { where: { workspaceId: tools.getId(workspace) } });
            return models.Job.findAndCountAll(options);
        })
        .then(function (result) {
            result.rows.forEach(function(job) { cache.put(getJobIdCacheKey(job.id), job); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list jobs, %s.', err.toString());
            throw err;
        });
});
/**
 * Create a new job.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    if (!attributes.name) {
        throw new errors.InvalidParams('Job name is not specified.');
    }
    if (!attributes.organizationId) {
        throw new errors.InvalidParams('Organization ID is not specified.');
    }
    if (!attributes.workspaceId) {
        throw new errors.InvalidParams('Workspace ID is not specified.');
    }

    var locals = { attrs: attributes };

    return using (models.transaction(), function (tx) {

        return workspaceAccess.ensureHasAccess(context, attributes.workspaceId,
                                               workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function() {
                logger.error(locals.attrs);
                return models.Schedule.create({
                    dtStart: locals.attrs.startsAt,
                    rrule: locals.attrs.rrule
                }, {transaction: tx});
            })
                .then(function(schedule){
                    locals.schedule = schedule;
                    locals.attrs.scheduleId = schedule.id;
                    return models.Job.create(locals.attrs, { transaction: tx });
                })

            .then(function (job) {
                locals.job = job;
                return Promise.join(
                    history.logCreated(context.personId, {
                                            organizationId: job.organizationId,
                                            workspaceId: job.workspaceId,
                                            scheduleId: job.scheduleId,
                                            jobId: job.id
                                        }, job, tx),
                    cache.put(getJobIdCacheKey(job.id), job));
            })
            .then(function() {
                if (locals.attrs.tags) {
                    var tags;
                    var arrayData = locals.attrs.tags;
                    // TODO: replace with promises (sequential foreach)
                    arrayData.forEach(function (tag) {
                        tags = {
                            jobId: locals.job.id,
                            tag: tag.toString()
                        };
                        models.JobTag.create(tags);
                    });
                }
            })
            .then(function() {
                locals.job.startsAt = locals.schedule.dtStart;
                locals.job.rrule = locals.schedule.rrule;
                return locals.job;
            });
        })
        .catch(function (err) {
            logger.error('Failed to create a job, %s.', err.toString());
            throw err;
        });
});

/**
 * Search for a single job by ID.
 */
var findById = module.exports.findById = Promise.method(function (context, id, workspaceRole, transaction) {
    id = tools.getId(id);
    workspaceRole = workspaceRole || workspaceAccess.WorkspaceRoles.Viewer;
    var locals = {};
    return cache.get(getJobIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Job.find({ where: { id: id } }, { transaction: transaction })
                .then(function (job) {
                    cache.put(getJobIdCacheKey(id), job);
                    return job;
                });
        })
        .then(function (job) {
            if (job === null) {
                return null;
            }
            locals.job = job;
            return workspaceAccess.ensureHasAccess(context, job.workspaceId, workspaceRole, transaction)
                .then(function () {
                    return locals.job;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a job by id %s, %s.', id, err.toString());
            throw err;
        });
});

var ensureCanView = module.exports.ensureCanView = function (context, job) {
    return findById(context, job, workspaceAccess.WorkspaceRoles.Viewer);
};

var ensureCanEdit = module.exports.ensureCanEdit = function (context, job) {
    return findById(context, job, workspaceAccess.WorkspaceRoles.Editor);
};


/**
 * Update a job.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return module.exports.findById(context, id, workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function (job) {
                if (job === null) {
                    throw new errors.NotFound();
                }

                locals.oldJob = job;

                return job.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function(job)
            {
                return models.Schedule.findAndCountAll({ where : { id : job.scheduleId } }).then(function(schedule)
                {
                    if(schedule && schedule.rows.length > 0)
                    {
                        schedule = schedule.rows[0];
                    }
                    var attsToUpdate = {};
                    attsToUpdate.dtStart = job.startsAt;
                    attsToUpdate.rrule = job.rrule;
                    schedule.updateAttributes(attsToUpdate, { transaction: tx })
                        .then(function(schedule){
                            locals.schedule = schedule;
                            return schedule;
                        });
                }).then(function(){
                    locals.job = job;
                    return Promise.join(
                        history.logUpdated(context.personId, {
                            organizationId: job.organizationId,
                            workspaceId: job.workspaceId,
                            jobId: job.id,
                            scheduleId: job.scheduleId
                        }, job, locals.oldJob, tx),
                        cache.put(getJobIdCacheKey(job.id), job),
                        function () {
                            locals.job.startsAt = locals.schedule.dtStart;
                            locals.job.rrule = locals.schedule.rrule;
                            return locals.job;
                        });
                });
            })
            .then(function() {
                if (locals.attrs.tags) {
                    return models.JobTag.destroy({where: {jobId: locals.job.id}, transaction: tx});
                }
            })
            .then(function(){
                if (locals.attrs.tags) {
                    var tags;
                    var arrayData = locals.attrs.tags;
                    // TODO: replace with promises (sequential foreach)
                    arrayData.forEach(function (tag) {
                        tags = {
                            jobId: locals.job.id,
                            tag: tag.toString()
                        };
                        models.JobTag.create(tags);
                    });
                }
            })
            .then (function(){
                return locals.job;
            });
        })
        .catch(function (err) {
            logger.error('Failed to update the job %d, %s.', id, err.toString());
            throw err;
        });
});
/**
 * Remove a job.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { };
        return findById(context, id, workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function (job) {
                if (job === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.job = job;
                return job.destroy({transaction: tx})
                    .then(function () {
                        return Promise.join(
                            history.logRemoved(context.personId, {
                                organizationId: locals.job.organizationId,
                                workspaceId: locals.job.workspaceId,
                                jobId: locals.job.id
                            }, locals.job, tx),
                            cache.remove(getJobIdCacheKey(locals.job.id)));
                    });
            });
        })
        .catch(function (err) {
            logger.error('Failed to remove the job %d, %s.', id, err.toString());
            throw err;
        });

});