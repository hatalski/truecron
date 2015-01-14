var Promise = require("bluebird"),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    models = require('./db/models');

var log = module.exports.log = Promise.method(function (personId, links, operation, newData, oldData, transaction) {
    if (!links || (!links.organizationId && !links.workspaceId && !links.jobId && !links.taskId &&
        !links.connectionId && !links.personId)) {
        throw new Error('Cannot log an event. At least one object ID must be set.');
    }
    var record = _.merge(links, {
        updatedByPersonId: personId,
        operation: operation,
        change: JSON.stringify(newData)
    });
    if (oldData) {
        record.oldValue = JSON.stringify(oldData);
    }
    return models.History.create(record, { transaction: transaction });
});

var logCreated = module.exports.logCreated = function (personId, links, newData, transaction) {
    return log(personId, links, 'created', newData, null, transaction);
};

var logUpdated = module.exports.logUpdated = function (personId, links, newData, oldData, transaction) {
    return log(personId, links, 'updated', newData, oldData, transaction);
};

var logRemoved = module.exports.logRemoved = function (personId, links, oldData, transaction) {
    return log(personId, links, 'removed', {}, oldData, transaction);
};

var logAccessGranted = module.exports.logAccessGranted = function (personId, links, accessEntry, transaction) {
    return log(personId, links, 'granted', accessEntry, null, transaction);
};

var logAccessRevoked = module.exports.logAccessRevoked = function (personId, links, accessEntry, transaction) {
    return log(personId, links, 'revoked', accessEntry, null, transaction);
};

var getObjectLog = module.exports.getObjectLog = Promise.method(function (links, options) {

    options = _.extend({ order: [['createdAt', 'desc']] }, options);
    options.where = _.extend({}, options.where, { resourceUrl: { like: objectPath + '%' } });
    return models.History.findAndCountAll(options);
});

var cleanUserLogs = module.exports.cleanUserLogs = Promise.method(function (personId, transaction) {
    return models.History.destroy({ where: { personid: personId }}, { transaction: transaction });
});
