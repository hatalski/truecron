var basicAuth = require('basic-auth'),
    Promise = require("bluebird"),
    validator = require('../lib/validator'),
    logger = require('../lib/logger'),
    secrets = require('../lib/secrets'),
    storage = require('../storage'),
    context = require('../context'),
    oauthErrors = require('./oautherrors');

//
// Authenticate client application by organization ID and a secret key.
// ID and a secret are passed as a username and password in via the Basic Authentication.
module.exports = function (req, res, next) {
    var credentials = basicAuth(req);
    req.client = null;

    if (!credentials || !validator.isInt(credentials.name) || !credentials.pass || credentials.pass.length === 0) {
        return next(oauthErrors.getInvalidClient());
    }

    logger.profile('authentication');
    storage.Organization.findById(context.newSystemContext(), parseInt(credentials.name, 10)).bind({})
        .then(function (organization) {
            logger.profile('authentication-bcrypt');
            if (!!organization && !!organization.secretHash) {
                this.organization = organization;
                return secrets.comparePasswordAndHash(credentials.pass, organization.secretHash);
            } else {
                logger.debug('Client authentication failed. Could not find client %s or it has no secret.', credentials.name);
                return false;
            }
        })
        .then(function (passwordIsGood) {
            logger.profile('authentication-bcrypt');
            logger.profile('authentication');
            if (passwordIsGood) {
                req.client = this.organization;
                logger.debug('Client authentication succeeded. Client %d %s.', this.organization.id, this.organization.name);
                next();
            } else {
                logger.debug('Client authentication failed. Invalid secret or unknown client %s.', credentials.name);
                return next(oauthErrors.getInvalidClient());
            }
        });
};
