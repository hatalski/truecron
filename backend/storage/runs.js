/**
 * Created by Andrew on 26.11.2014.
 */
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
var getRunIdCacheKey = function(runId) {
    return 'run/' + runId;
};

var createRun = module.exports.createRun = Promise.method(function (context, jobId, attributes) {
    attributes.updatedByPersonId = context.personId;
    attributes.jobId = jobId;
    return using(models.transaction(), function (tx) {
        return models.Run.create(attributes, { transaction: tx });
    })
        .catch(function (err) {
            logger.error('Failed create run on the job %d .', jobId, err.toString());
            throw err;
        });
});

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
var findById = module.exports.findById = Promise.method(function (context, id, jobid, transaction) {
    return cache.get(getRunIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Run.find({ where: { id: id, jobId: jobid } }, { transaction: transaction })
                .then(function (run) {
                    cache.put(getRunIdCacheKey(id), run);
                    return run;
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
var update = module.exports.update = Promise.method(function (context, id, jobid, attributes) {
    attributes.updatedByPersonId = context.personId;
    var self = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        self.tx = tx;
        return module.exports.findById(context, id, jobid, tx)
            .then(function (run) {
                if (run === null) {
                    throw new errors.NotFound();
                }
                self.oldRun = run;
                return run.updateAttributes(self.attrs, { transaction: self.tx });
            })
            .then(function (run) {
                self.run = run;
                return history.logUpdated(context.personId, getRunIdCacheKey(run.id), run, self.oldRun, self.tx);
            })
            .then(function () {
                cache.put(getRunIdCacheKey(self.run.id), self.run);
                return self.run;
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
        var self = { tx: tx };
        return findById(context, id)
            .then(function (run) {
                if (run === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                self.run = run;
                return run.destroy({transaction: self.tx})
                    .then(function () {
                        return history.logRemoved(context.personId, getRunIdCacheKey(self.run.id), self.run, self.tx);
                    })
                    .then(function () {
                        cache.remove(getRunIdCacheKey(self.run.id))
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to remove the run %d, %s.', id, err.toString());
            throw err;
        });
});

