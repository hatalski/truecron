//
// OAuth2 mini server
//
var express = require('express'),
    Promise = require("bluebird"),
    config = require('../lib/config'),
    validator = require('../lib/validator'),
    logger = require('../lib/logger'),
    secrets = require('../lib/secrets'),
    storage = require('../storage'),
    context = require('../context'),
    clientAuth = require('./clientauth'),
    oauthErrors = require('./oautherrors'),
    token = require('./token');

var router = express.Router();

//
// Client authentication, required for all requests
//
router.use(clientAuth);

var supportedGrantTypes = ['refresh_token', 'password', 'client_credentials', 'http://google.com'];

router.post('/token', function (req, res, next) {
    if (!req.is('application/x-www-form-urlencoded')) {
        return next(oauthErrors.getInvalidRequest('Request must use application/x-www-form-urlencoded encoding.'));
    }
    if (!req.body || !validator.isIn(req.body.grant_type, supportedGrantTypes)) {
        return next(oauthErrors.getUnsupportedGrantType());
    }

    if (req.body.grant_type === 'password') {
        return passwordAuth(req, res, next);
    } else if (req.body.grant_type === 'client_credentials') {
        return clientCredentialsAuth(req, res, next);
    } else if (req.body.grant_type === 'http://google.com') {
        return googleAuth(req, res, next); // Our grant extension, authenticates by just an email
    } else if (req.body.grant_type === 'refresh_token') {
        return refreshToken(req, res, next);
    } else {
        next(oauthErrors.getUnsupportedGrantType());
    }
});

var ensureClientCanAuthenticate = Promise.method(function(clientId, personId, grantType) {
    // TODO: Consult the storage to figure out if the client is allowed to authenticate the given person.
    if (clientId == -2) {
        return true;
    }
    throw oauthErrors.getUnauthorizedClient();
});

var refreshToken = function(req, res, next) {
    req.checkBody('refresh_token', 'Missing token.').isLength(1);
    var errors = req.validationErrors();
    if (errors) {
        return next(oauthErrors.getInvalidRequest());
    }
    token.verifyAndDecodeToken(req.body.refresh_token, function (err, refreshContext) {
        if (err) {
            return next(oauthErrors.getInvalidGrant(err.message));
        }
        if (+req.client.id !== +refreshContext.clientId) {
            logger.error('Refreshing token failure. Client in refresh token %d, current client %d.', refreshContext.clientId, req.client.id);
            return next(oauthErrors.getInvalidGrant('Wrong client.'));
        }
        logger.debug('Refreshing token for person %d, client %d.', refreshContext.personId, refreshContext.clientId);
        return token.issue(refreshContext, req, res, next);
    });
};

var passwordAuth = function(req, res, next) {
    req.checkBody('username', 'Missing username.').isLength(1, 256).isEmail();
    req.checkBody('password', 'Missing password.').isLength(1);
    var errors = req.validationErrors();
    if (errors) {
        return next(oauthErrors.getInvalidRequest());
    }
    return storage.Person.findByEmail(context.newSystemContext(), req.body.username)
        .then(function (person) {
            if (person === null) {
                logger.debug('Failed to authenticate %s with password. User not found', req.body.username);
                return next(oauthErrors.getInvalidGrant()); // Can't be more specific, otherwise we will reveal user emails
            }

            return ensureClientCanAuthenticate(req.client.id, person.id, 'password')
                .then(function() {
                    return secrets.comparePasswordAndHash(req.body.password, person.passwordHash)
                })
                .then(function (passwordIsGood) {
                    if (passwordIsGood) {
                        logger.debug('Authenticated %s (%d) with password, client %d.', req.body.username, person.id, req.client.id);
                        return token.issue(new context.Context(person.id, req.client.id), req, res, next);
                    } else {
                        logger.debug('Failed to authenticate %s with password. Invalid password.', req.body.username);
                        return next(oauthErrors.getInvalidGrant());
                    }
                });
        })
        .catch(function (err) {
            logger.error('Failed to authenticate %s with password. %s', req.body.username, err.toString());
            next(err);
        });
};

/**
 * This our grant extension for OAuth. Similar to 'password', but authenticates by just a email.
 */
var googleAuth = function(req, res, next) {
    req.checkBody('username', 'Missing username.').isLength(1, 256).isEmail();
    var errors = req.validationErrors();
    if (errors) {
        return next(oauthErrors.getInvalidRequest());
    }
    return storage.Person.findByEmail(context.newSystemContext(), req.body.username)
        .then(function (person) {
            if (person === null) {
                logger.debug('Failed to authenticate %s with Google. User not found', req.body.username);
                return next(oauthErrors.getInvalidGrant()); // Can't be more specific, otherwise we will reveal user emails
            }

            return ensureClientCanAuthenticate(req.client.id, person.id, 'password')
                .then(function () {
                    logger.debug('Authenticated %s (%d) with google, client %d.', req.body.username, person.id, req.client.id);
                    token.issue(new context.Context(person.id, req.client.id), req, res, next);
                });
        })
        .catch(function (err) {
            logger.error('Failed to authenticate %s with Google. %s', req.body.username, err.toString());
            next(err);
        });
};

var clientCredentialsAuth = function(req, res, next) {
    // TODO: Think of the client authentication token. Does it need a user ID? Which one?
    logger.debug('TODO: Authenticated client %d with hardcoded person %d.', req.client.id, context.SystemPersonId);
    token.issue(new context.Context(context.SystemPersonId, req.client.id), req, res, next);
};

//
// Converts and returns errors according to OAUTH spec
router.use(oauthErrors.errorHandler);

module.exports = router;