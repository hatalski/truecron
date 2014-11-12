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
    if (validationErrors && util.isError(validationErrors)) {
        this.parent = validationErrors;
        this.message += '. ' + validationErrors.toString();
    }
    if (validationErrors && util.isArray(validationErrors)) {
        this.errors = validationErrors;
    }
};

util.inherits(InvalidParams, Error);

var NotAuthenticated = module.exports.NotAuthenticated = function (message) {
    Error.call(this);
    this.status = 401;
    this.message = message || 'Please authenticate';
};

util.inherits(NotAuthenticated, Error);

var AccessDenied = module.exports.AccessDenied = function (message, data) {
    Error.call(this);
    this.status = 403;
    this.data = data;
    this.message = message || 'Access denied';
};

util.inherits(AccessDenied, Error);

var NotSupported = module.exports.NotSupported = function (message) {
    Error.call(this);
    this.status = 405;
    this.message = message || 'The operation is not supported';
};

util.inherits(NotSupported, Error);


var composeMessageFromErrorChain = function (err) {
    var text = '';
    var append = function(msg) {
        if (text.length > 0) {
            // Separate messages with a dot and a whitespace
            text += ('.' === text.charAt(text.length - 1)) ? ' ' : '. ';
        }
        text += msg;
    };

    for (; err; err = err.parent) {
        var message = err.message || err.msg;
        if (message && text.indexOf(message) < 0) { // Ignore duplicates
            append(message);
        }
        if (err.errors && Array.isArray(err.errors)) {
            err.errors.forEach(function (innerErr) {
                append(composeMessageFromErrorChain(innerErr));
            });
        }
    }
    return text;
};

/**
 * Converts any error to one with a status (HTTP code) and non-empty message fields.
 */
var normalizeError = module.exports.normalizeError = function (err) {
    var status = err.status;
    var message = 'Internal error';
    if (!status) {
        // Check for errors caused by invalid arguments
        if (err.name === 'SequelizeUniqueConstraintError') {
            status = 400;
            message = 'Uniqueness violation';
        }
        if (err.name === 'SequelizeValidationError') {
            status = 400;
            message = 'Validation error';
        }
        if (err.name === 'SequelizeForeignKeyConstraintError') {
            status = 400;
            message = 'Foreign key constraint violation';
        }
    }
    err.status = status || 500;
    err.message = composeMessageFromErrorChain(err) || message;
    return err;
};