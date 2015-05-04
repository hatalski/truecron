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
    workspaceAccess = require('./workspace-access'),
    jobCounters = require('./jobcounters');

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
            options = _.merge(options || {}, {
                where: { workspaceId: tools.getId(workspace) }
            });
            if (options.where.tag) {
                options = _.merge(options || {}, {
                    where: { workspaceId: tools.getId(workspace) },
                    include: [ { model: models.JobTag, as: 'tags', where: { tag: options.where.tag }} ]
                });
                delete options.where.tag;
            } else {
                options = _.merge(options || {}, {
                    include: [ { model: models.JobTag, as: 'tags' } ]
                });
            }
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
        return workspaceAccess.ensureHasAccess(context, attributes.workspaceId, workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function() {
                return models.Job.create(locals.attrs, { transaction: tx });
            })
            .then(function (job) {
                locals.job = job;
                if (!locals.attrs.tags) {
                    return job;
                }
                locals.job.tags = locals.attrs.tags.map(function (t) { return { jobId: locals.job.id, tag: t }; });
                return models.JobTag.bulkCreate(
                    locals.job.tags,
                    { validate: true, transaction: tx }
                );
            })
            .then(function () {
                return Promise.join(
                    history.logCreated(context.personId, {
                        organizationId: locals.job.organizationId,
                        workspaceId: locals.job.workspaceId,
                        jobId: locals.job.id
                    }, locals.job, tx),
                    cache.put(getJobIdCacheKey(locals.job.id), locals.job));
            })
    })
        .then(function(){
        return jobCounters.create(context, jobcounter = {
                                jobId           : locals.job.id,
                                workspaceId     : locals.job.workspaceId,
                                organizationId  : locals.job.organizationId
                                });
    })
        .then(function(jobcounter) {
            locals.job.dataValues.jobcounter = jobcounter;
            return locals.job;
        })
    .catch(function (err) {
        logger.error('Failed to create a job, %s.', err.toString());
        throw err;
    })
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
            return models.Job.find({
                    where: { id: id },
                    include: [ { model: models.JobTag, as: 'tags'} ] }, {
                    transaction: transaction
                })
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
    if (locals.attrs.tags) {
        locals.tags = locals.attrs.tags;
        delete locals.attrs.tags;
    }
    return using (models.transaction(), function (tx) {
        return module.exports.findById(context, id, workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function (job) {
                if (job === null) {
                    throw new errors.NotFound();
                }
                locals.oldJob = job;
                return job.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function (job) {
                // Process tags
                locals.job = job;
                if (!locals.tags) {
                    return job;
                }
                locals.job.tags = locals.tags.map(function (t) { return { jobId: locals.job.id, tag: t }; });
                return models.JobTag.destroy({ where: { jobId: locals.job.id }, transaction: tx })
                    .then(function () {
                        return models.JobTag.bulkCreate(
                            locals.job.tags,
                            { validate: true, transaction: tx }
                        );
                    });
            })
            .then(function () {
                // Logging and caching
                return Promise.join(
                    history.logUpdated(context.personId, {
                        organizationId: locals.job.organizationId,
                        workspaceId: locals.job.workspaceId,
                        jobId: locals.job.id
                    }, locals.job, locals.oldJob, tx),
                    cache.put(getJobIdCacheKey(locals.job.id), locals.job),
                    function () {
                        return locals.job;
                    });
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
