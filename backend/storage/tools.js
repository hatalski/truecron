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
