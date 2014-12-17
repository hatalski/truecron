var Promise = require("bluebird"),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    models = require('./db/models'),
    links = require('../api/links'); // This is the only dependency of the Storage on the API.

var log = module.exports.log = Promise.method(function (personId, objectPath, operation, newData, oldData, transaction) {
    var record = {
        personId: personId,
        resourceUrl: objectPath,
        operation: operation,
        change: JSON.stringify(newData)
    };
    if (!!oldData) {
        record.oldValue = JSON.stringify(oldData);
    }
    return models.History.create(record, { transaction: transaction });
});

var logCreated = module.exports.logCreated = function (personId, objectPath, newData, transaction) {
    return log(personId, objectPath, 'created', newData, null, transaction);
};

var logUpdated = module.exports.logUpdated = function (personId, objectPath, newData, oldData, transaction) {
    return log(personId, objectPath, 'updated', newData, oldData, transaction);
};

var logRemoved = module.exports.logRemoved = function (personId, objectPath, oldData, transaction) {
    return log(personId, objectPath, 'removed', {}, oldData, transaction);
};

var logAccessGranted = module.exports.logAccessGranted = function (personId, objectPath, accessEntry, transaction) {
    return log(personId, objectPath, 'granted', accessEntry, null, transaction);
};

var logAccessRevoked = module.exports.logAccessRevoked = function (personId, objectPath, accessEntry, transaction) {
    return log(personId, objectPath, 'revoked', accessEntry, null, transaction);
};

var getObjectLog = module.exports.getObjectLog = Promise.method(function (objectPath, options) {
    options = _.extend({ order: [['createdAt', 'desc']] }, options);
    options.where = _.extend({}, options.where, { resourceUrl: { like: objectPath + '%' } });
    return models.History.findAndCountAll(options);
});

var cleanUserLogs = module.exports.cleanUserLogs = Promise.method(function (personId, transaction) {
    return models.History.destroy({ where: { personid: personId }}, { transaction: transaction });
});
