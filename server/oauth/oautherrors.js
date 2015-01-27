var util = require('util');

var OAuthError = module.exports.OAuthError = function (status, code, description) {
    Error.call(this);
    this.status = status || 'invalid_request';
    this.code = code || 400;
    this.description = description || '';
    this.headers = null;
};

util.inherits(OAuthError, Error);

module.exports.getInvalidRequest = function (description) {
    return new OAuthError('invalid_request', 400, description);
};

module.exports.getInvalidClient = function (description) {
    var err = new OAuthError('invalid_client', 401, description);
    err.headers = { 'WWW-Authenticate': 'Basic realm="truecron"' };
    return err;
};

module.exports.getInvalidGrant = function (description) {
    return new OAuthError('invalid_grant', 400, description);
};

module.exports.getUnauthorizedClient = function (description) {
    return new OAuthError('unauthorized_client', 400, description);
};

module.exports.getUnsupportedGrantType = function (description) {
    return new OAuthError('unsupported_grant_type', 400, description);
};

module.exports.getInvalidScope = function (description) {
    return new OAuthError('invalid_scope', 400, description);
};

module.exports.errorHandler = function (err, req, res, next) {
    if (!(err instanceof OAuthError)) {
        err = module.exports.getInvalidRequest(err.message);
    }
    if (err.headers) {
        res.set(err.headers);
    }
    res.status(err.code || 400);
    res.json({
        error: err.status,
        error_description: err.description
    });
};