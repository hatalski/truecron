var validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

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
    delete attributes.createdAt;
    delete attributes.updatedAt;
    attributes.updatedByPersonId = context.personId;
    return attributes;
};
