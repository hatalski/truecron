var superagent = require('./sagent'),
    Promise    = require('bluebird'),
    url        = require('url'),
    expect     = require('expect.js'),
    config     = require('../lib/config.js'),
    log        = require('../lib/logger.js'),
    testdata   = require('./testdata') ;

var oauthTokenUrl = url.resolve(config.get('API_HOST'), '/oauth/token');
var defaultUserEmail = config.get('TEST_DEFAILT_USER_EMAIL') || testdata.system.email; // authenticate as SYSTEM user if not specified
var clientId = config.get('TEST_CLIENT_ID') || -2;
var clientSecret = config.get('TEST_CLIENT_SECRET') || 'Igd7en1_VCMP59pBpmEF';

/**
 * Gets OAuth access token for the specified user (email).
 * @param {string} [userEmail]. Optional, email of the user to authenticate. If not specified, SYSTEM user is authenticated.
 * @param {function(err,token)} callback A callback function that gets a token or an error.
 */
module.exports.getAccessToken = Promise.method(function(userEmail, callback) {
    if (typeof userEmail === 'function') {
        callback = userEmail;
        userEmail = defaultUserEmail;
    } else {
        userEmail = userEmail || defaultUserEmail;
    }
    return superagent.post(oauthTokenUrl)
            .type('application/x-www-form-urlencoded')
            .send('grant_type=http://google.com')
            .send('username=' + userEmail)
            .auth(clientId.toString(), clientSecret)
            .endAsync()
        .then(function (res) {
            expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
            expect(res.body.access_token).to.be.a('string');
            expect(res.body.token_type).to.eql('bearer');
            return res.body.access_token;
        })
        .nodeify(callback);
});

