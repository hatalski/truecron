var jwt = require('jsonwebtoken'),
    config = require('../lib/config'),
    errors = require('../lib/errors'),
    context = require('../context');

var settings = {
    secret:                  config.get('OAUTH_SECRET'),
    expiresInMinutes:        config.get('OAUTH_TOKEN_EXPIRATION_MINUTES') || 60, // an hour
    refreshExpiresInMinutes: config.get('OAUTH_REFRESH_TOKEN_EXPIRATION_MINUTES') || 7 * 24 * 60, // a week
    scope:                   config.get('OAUTH_TOKEN_SCOPE') || 'all'
};

/**
 * Issue and send a bearer token for the specified security context.
 */
module.exports.issue = function(context, req, res, next) {
    var data = {
        uid: context.personId,
        cid: context.clientId
    };
    var token = jwt.sign(data, settings.secret, { expiresInMinutes: settings.expiresInMinutes });
    var refreshToken = jwt.sign(data, settings.secret, { expiresInMinutes: settings.refreshExpiresInMinutes });
    res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
    });
    res.json({
            access_token: token,
            refresh_token: refreshToken,
            token_type: 'bearer',
            expires_in: settings.expiresInMinutes * 60,
            scope: settings.scope,
            state: req.body.state
        }
    );
};

/**
 * Middleware that extracts bearer tokens issued by the issue() function, validates them, and sets req.context with
 * authenticated user and client IDs.
 * If the token is invalid, the request ends with 401 code.
 */
module.exports.verify = function(req, res, next) {
    var token = '';
    var headerToken = req.get('Authorization');
    if (headerToken) {
        var parts = headerToken.split(' ');
        if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
            token = parts[1];
        }
    }
    if (!token && req.query && req.query['access_token']) {
        token = req.query['access_token'];
    }
    if (!token && req.body && req.body['access_token']) {
        token = req.body['access_token'];
    }

    if (token) {
        module.exports.verifyAndDecodeToken(token, function (err, context) {
            if (err) {
               return next(err);
            }
            req.context = context;
            return next();
        });
    } else {
        next(new errors.NotAuthenticated());
    }
};

/**
 * Decodes and validates a token string. Returns a decoded Context.
 * @param token Token string to decode and validate.
 * @param callback A function (err, context) that gets a decoded context or an error if a token is invalid or expired.
 */
module.exports.verifyAndDecodeToken = function(token, callback) {
    jwt.verify(token, settings.secret, function (err, decoded) {
        if (err) {
            return callback(err);
        }
        if (!decoded.uid || !decoded.cid) {
            return callback(new errors.NotAuthenticated('Invalid token.'));
        }
        return callback(null, new context.Context(decoded.uid, decoded.cid));
    });
};