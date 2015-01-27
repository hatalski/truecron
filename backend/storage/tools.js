var Promise = require("bluebird"),
    _ = require('lodash'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors'),
    organizationAccess = require('./organization-access');

module.exports.getId = function (idOrObject) {
    var id = idOrObject;
    if (typeof idOrObject === 'object') {
        id = idOrObject.id;
    }
    if (!validator.isInt(id)) {
        throw new errors.InvalidParams('Invalid ID.');
    }
    return +id;
};

module.exports.sanitizeAttributesForCreate = function (context, attributes) {
    if (!attributes) {
        throw new errors.InvalidParams();
    }
    delete attributes.id;
    delete attributes.createdAt;
    delete attributes.updatedAt;
    attributes.updatedByPersonId = context.personId;
    return attributes;
};

module.exports.sanitizeAttributesForUpdate = function (context, attributes) {
    if (!attributes) {
        throw new errors.InvalidParams();
    }
    delete attributes.id;
    delete attributes.organizationId; // Cannot move an object between organizations
    delete attributes.createdAt;
    delete attributes.updatedAt;
    attributes.updatedByPersonId = context.personId;
    return attributes;
};

module.exports.limitQueryToAccessibleOrganizations = Promise.method(function (context, options, transaction) {
    if (context.isSystem()) {
        return options;
    }
    return organizationAccess.getAccessibleOrganizations(context, transaction)
        .then(function (accessEntries) {
            var accessibleIds = _.keys(accessEntries);
            return _.merge(options, { where: { organizationId: accessibleIds }});
        });
});

