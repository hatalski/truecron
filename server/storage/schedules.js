/**
 * Created by estet on 4/1/15.
 */

var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools');

var using = Promise.using;

/**
 * For cache.
 */
var getScheduleIdCacheKey = function(scheduleId) {
    return 'schedule/' + scheduleId;
};

/**
 * Create a new schedule.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    if (!attributes.dtStart) {
        throw new errors.InvalidParams('Start date is not specified.');
    }
    if (!attributes.rrule) {
        throw new errors.InvalidParams('RRule is not specified.');
    }

    var locals = { attrs: attributes };

    return using (models.transaction(), function (tx) {
            return models.Schedule.create(
                locals.attrs
            , {transaction: tx})
    })
    .catch(function (err) {
        logger.error('Failed to create a schedule, %s.', err.toString());
        throw err;
    });
});

/**
 * Search for a single schedule by ID.
 */
var findById = module.exports.findById = Promise.method(function (context, id, transaction) {
    id = tools.getId(id);
    var locals = {};
    return cache.get(getScheduleIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Schedule.find({ where: { id: id } }, { transaction: transaction })
                .then(function (schedule) {
                    cache.put(getScheduleIdCacheKey(id), schedule);
                    return schedule;
                });
        })
        .then(function (schedule) {
            if (schedule === null) {
                return null;
            }
            return schedule;
        })
        .catch(function (err) {
            logger.error('Failed to find a schedule by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Update a schedule.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return module.exports.findById(context, id, tx)
            .then(function (schedule) {
                if (schedule === null) {
                    throw new errors.NotFound();
                }

                locals.oldSchedule = schedule;

                return schedule.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function(schedule)
            {
                locals.schedule = schedule;
                cache.put(getScheduleIdCacheKey(schedule.id), schedule);
                return locals.schedule;
            });
    })
    .catch(function (err) {
        logger.error('Failed to update the job %d, %s.', id, err.toString());
        throw err;
    });
});
/**
 * Remove a schedule.
 */
var remove = module.exports.remove = Promise.method(function (context, id) {
    return using (models.transaction(), function (tx) {
        var locals = { };
        return findById(context, id, tx)
            .then(function (schedule) {
                if (schedule === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                locals.schedule = schedule;
                return schedule.destroy({transaction: tx})
                    .then(function () {
                        cache.remove(getScheduleIdCacheKey(locals.schedule.id));
                    });
            });
    })
        .catch(function (err) {
            logger.error('Failed to remove the schedule %d, %s.', id, err.toString());
            throw err;
        });

});