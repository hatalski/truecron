/**
 * Created by Andrew on 22.10.2014.
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
var getJobIdCacheKey = function(jobId) {
    return 'job/' + jobId;
};

//
// Jobs
//

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (options) {
    return models.Job.findAndCountAll(options)
        .then(function (result) {            
            result.rows.forEach(function(job) { cache.put(getJobIdCacheKey(job.id), job); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list jobs, %s.', err.toString());
            throw err;
        });
});
var process = Promise.method(function (attributes) {
    return attributes;
});
/**
 * Create a new job.
 */
var create = module.exports.create = Promise.method(function (attributes) {
    if (!attributes || validator.isNull(attributes.name)) {
        throw new errors.InvalidParams();
    }
    return process(attributes).bind({}) //need delete this
        .then(function (attrs) {
            var self = { attrs: attrs };
            return using (models.transaction(), function (tx) {
                self.tx = tx;
                return models.Job.create(self.attrs, { transaction: tx })
                    .then(function (job) {
                        self.job = job;
                        return history.logCreated(-1, getJobIdCacheKey(job.id), job, self.tx);
                    })
                    .then(function () {
                        cache.put(getJobIdCacheKey(self.job.id), self.job);
                        return self.job;
                    });
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
var findById = module.exports.findById = Promise.method(function (id, transaction) {
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
        .catch(function (err) {
            logger.error('Failed to find a job by id %s, %s.', id, err.toString());
            throw err;
        });
});