/**
 * This module offers two things:
 *
 * 1. An simple OAuth2 server implementation that issues access tokens for standard 'password' and 'client_credentials'
 * grant types and our extension grant type 'http://google', which authenticate a user by email only.
 *
 * 2. A middleware that extracts an access token from the request, validates it, and sets req.personId and req.clientId
 * fields. If validation fails, the request is terminated with 401 code.
 */
module.exports = {
    oAuthServer: require('./server'),
    authenticate: require('./authenticate')
};
