var jwt = require('jsonwebtoken'),
    config = require('../../lib/config'),
    errors = require('../../lib/errors'),
    context = require('../context');

var settings = {
    secret:           config.get('OAUTH_SECRET'),
    expiresInMinutes: config.get('OAUTH_TOKEN_EXPIRATION_MINUTES') || 60,
    scope:            config.get('OAUTH_TOKEN_SCOPE') || 'all'
};

/**
 * Issue and send a bearer token for the specified security context.
 */
module.exports.issue = function(context, req, res, next) {
    var token = jwt.sign(context, settings.secret, { expiresInMinutes: settings.expiresInMinutes });
    res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
    });
    res.json({
            access_token: token,
            token_type: 'bearer',
            expires_in: settings.expiresInMinutes * 60,
            scope: settings.scope,
            state: req.param('state')
        }
    );
};

/**
 * Middleware that extracts bearer tokens issued by the issue() function, validates them, and sets req.context with
 * authenticated user and client IDs.
 * If the token is invalid, the request ends with 401 code.
 */
module.exports.verify = function(req, res, next) {
    // Fallback value if authentication fails.
    req.context = context.SystemContext;
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
        jwt.verify(token, settings.secret, function (err, decoded) {
            if (err) {
               return next(err);
            }
            // Clone the decoded object to make it a Context instance and get rid of JWT fields.
            req.context = context.clone(decoded);
            return next();
        });
    } else {
        next(new errors.NotAuthenticated());
    }
};
