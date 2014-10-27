var jwt = require('jsonwebtoken'),
    config = require('../../lib/config'),
    errors = require('../../lib/errors');

/**
 * Issue and send a bearer token for the specified person ID and req.client.id.
 */
module.exports.issue = function(personId, req, res, next) {
    var token = jwt.sign({
            clientId: req.client.id,
            personId: personId
        },
        config.get('OAUTH_SECRET'), {
            expiresInMinutes: config.get('OAUTH_TOKEN_EXPIRATION_MINUTES')
        });
    res.set({
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
    });
    res.json({
            access_token: token,
            token_type: 'bearer',
            expires_in: config.get('OAUTH_TOKEN_EXPIRATION_MINUTES') * 60,
            scope: 'all',
            state: req.param('state')
        }
    );
};

/**
 * Middleware that extracts bearer tokens issued by the issue() function, validates them, and sets req.userId and req.clientId.
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
        jwt.verify(token, config.get('OAUTH_SECRET'), function (err, decoded) {
            if (err) {
               return next(err);
            }
            req.clientId = decoded.clientId;
            req.personId = decoded.personId;
            return next();
        });
    } else {
        next(new errors.NotAuthenticated());
    }
};
