var basicAuth = require('basic-auth'),
    Promise = require("bluebird"),
    validator = require('../../lib/validator'),
    logger = require('../../lib/logger'),
    secrets = require('../../lib/secrets'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors');

//
// Authenticate application by organization ID and a secret key.
// ID and a secret are passed as a username and password in via the Basic Authentication.
module.exports = function (req, res, next) {

    var unauthorized = function(res) {
        res.set('WWW-Authenticate', 'Basic realm="truecron"');
        return next(new apiErrors.NotAuthenticated());
    };

    var credentials = basicAuth(req);
    req.authenticated = false;
    req.client = null;

    if (!credentials || !validator.isInt(credentials.name) || !credentials.pass || credentials.pass.length === 0) {
        return unauthorized(res);
    }

    logger.profile('authentication');
    storage.tempfindOrganizationById(parseInt(credentials.name, 10)).bind({})
        .then(function (organization) {
            logger.profile('authentication-bcrypt');
            if (!!organization && !!organization.secretHash) {
                this.organization = organization;
                return secrets.comparePasswordAndHash(credentials.pass, organization.secretHash);
            } else {
                logger.debug('Authentication failed. Could not find client %s or it has no secret.', credentials.name);
                return false;
            }
        })
        .then(function (passwordIsGood) {
            req.authenticated = passwordIsGood;
            logger.profile('authentication-bcrypt');
            logger.profile('authentication');
            if (passwordIsGood) {
                req.client = this.organization;
                logger.debug('Authentication succeeded. Client %d %s.', this.organization.id, this.organization.name);
                next();
            } else {
                logger.debug('Authentication failed. Invalid secret or unknown client %s.', credentials.name);
                return unauthorized(res);
            }
        });
};



