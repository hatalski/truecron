var Promise = require("bluebird"),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    models = require('./db/models'),
    tools = require('./tools');

var getEntityType = function(ids) {
    if (ids.taskId) {
        return 'task';
    } else if (ids.jobId) {
        return 'job';
    } else if (ids.jobId) {
        return 'job';
    } else if (ids.workspaceId) {
        return 'workspace';
    } else if (ids.connectionId) {
        return 'connection';
    } else if (ids.organizationId) {
        return 'organization';
    } else if (ids.personId) {
        return 'person';
    } else {
        throw new Error('Unknown type of entity is being logged. Ensure at least one ID is specified.');
    }
};

var log = module.exports.log = Promise.method(function (personId, ids, operation, newData, oldData, transaction) {
    if (!ids || (!ids.organizationId && !ids.workspaceId && !ids.jobId && !ids.taskId &&
        !ids.connectionId && !ids.personId)) {
        throw new Error('Cannot log an event. At least one object ID must be set.');
    }
    var record = _.merge(ids, {
        updatedByPersonId: personId,
        operation: operation,
        entity: getEntityType(ids),
        change: JSON.stringify(newData)
    });
    if (oldData) {
        record.oldValue = JSON.stringify(oldData);
    }
    return models.History.create(record, { transaction: transaction });
});

var logCreated = module.exports.logCreated = function (personId, ids, newData, transaction) {
    return log(personId, ids, 'created', newData, null, transaction);
};

var logUpdated = module.exports.logUpdated = function (personId, ids, newData, oldData, transaction) {
    return log(personId, ids, 'updated', newData, oldData, transaction);
};

var logRemoved = module.exports.logRemoved = function (personId, ids, oldData, transaction) {
    return log(personId, ids, 'removed', {}, oldData, transaction);
};

var logAccessGranted = module.exports.logAccessGranted = function (personId, ids, accessEntry, transaction) {
    return log(personId, ids, 'granted', accessEntry, null, transaction);
};

var logAccessRevoked = module.exports.logAccessRevoked = function (personId, ids, accessEntry, transaction) {
    return log(personId, ids, 'revoked', accessEntry, null, transaction);
};

var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (context, options) {
    options = _.extend({ order: [['createdAt', 'desc']] }, options);
    return Promise.try(function() {
            if (options.where.organizationId) {
                return tools.limitQueryToAccessibleOrganizations(context, options);
            } else {
                return options;
            }
        })
        .then(function (newOptions) {
            return models.History.findAndCountAll(newOptions);
        });
});

var cleanUserLogs = module.exports.cleanUserLogs = Promise.method(function (personId, transaction) {
    return models.History.destroy({ where: { personid: personId }}, { transaction: transaction });
});
