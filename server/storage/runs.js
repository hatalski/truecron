/**
 * Created by Andrew on 26.11.2014.
 */
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
    jobs = require('./jobs'),
    jobCounters = require('./jobcounters');

var using = Promise.using;

//
//  for cache
//
var getRunIdCacheKey = function(runId) {
    return 'run/' + runId;
};

//
// Create run
//

var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    var locals = attributes;
    if (!attributes.organizationId) {
        throw new errors.InvalidParams('Organization ID is not specified.');
    }
    if (!attributes.workspaceId) {
        throw new errors.InvalidParams('Workspace ID is not specified.');
    }
    if (!attributes.jobId) {
        throw new errors.InvalidParams('jobId is not specified.');
    }
    return using(models.transaction(), function (tx) {
        return models.Run.create(attributes, { transaction: tx });
    })
    .then(function(runCreated) {
        locals.run = runCreated;
        return jobCounters.update(context, locals.jobId, jobcounter = {
                                jobId           : locals.jobId,
                                workspaceId     : locals.workspaceId,
                                organizationId  : locals.organizationId,
                                lastRunId       : runCreated.id
                                });
        })
        .then(function(jobcounter){
            locals.run.dataValues.jobcounter = jobcounter;
            return locals.run;
        })

    .catch(function (err) {
        logger.error('Failed create run on the job %d .', attributes.jobId, err.toString());
        throw err;
    });
});

//
// findAndCountAll run
//

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    return models.Run.findAndCountAll(options)
        .then(function (result) {
            result.rows.forEach(function(run) { cache.put(getRunIdCacheKey(run.id), run); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list runs, %s.', err.toString());
            throw err;
        });
});

//
// Search for a single run by ID.
//
var findById = module.exports.findById = Promise.method(function (context, id, forEdit, transaction) {
    var locals = {};
    return cache.get(getRunIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Run.find({ where: { id: id } }, { transaction: transaction })
                .then(function (run) {
                    cache.put(getRunIdCacheKey(id), run);
                    locals.run = run;
                    if (!run) {
                        return run;
                    }
                    if (forEdit) {
                        return jobs.ensureCanEdit(context, run.jobId);
                    } else {
                        return jobs.ensureCanView(context, run.jobId);
                    }
                })
                .then(function (){
                    return locals.run;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a run by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Update a run.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        locals.tx = tx;
        return findById(context, id, true, tx) // findById will check access rights
            .then(function (run) {
                if (run === null) {
                    throw new errors.NotFound();
                }
                return run.updateAttributes(locals.attrs, { transaction: locals.tx });
            })
            .then(function (run) {
                cache.put(getRunIdCacheKey(locals.run.id), locals.run);
                return run;
            });
    })
        .catch(function (err) {
            logger.error('Failed to update the run %d, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Remove a run.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { tx: tx };
        return findById(context, id, true, tx) // findById will check access rights
            .then(function (run) {
                if (run === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                return run.destroy({transaction: tx})
                    .then(function () {
                        cache.remove(getRunIdCacheKey(id));
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to remove the run %d, %s.', id, err.toString());
            throw err;
        });
});

