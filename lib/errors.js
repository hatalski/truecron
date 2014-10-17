var util = require('util');

var NotFound = module.exports.NotFound = function (message) {
    Error.call(this);
    this.status = 404;
    this.message = message || 'Not found';
};

util.inherits(NotFound, Error);

var InvalidParams = module.exports.InvalidParams = function (validationErrors) {
    Error.call(this);
    this.status = 400;
    this.message = 'Invalid parameters';
    if (typeof validationErrors === 'string' && validationErrors.length > 0) {
        this.message += '. ' + validationErrors;
    }
    if (!!validationErrors && util.isError(validationErrors)) {
        this.message += '. ' + validationErrors.toString();
    }
};

util.inherits(InvalidParams, Error);

var NotAuthenticated = module.exports.NotAuthenticated = function (message) {
    Error.call(this);
    this.status = 401;
    this.message = message || 'Please authenticate';
};

util.inherits(NotAuthenticated, Error);
