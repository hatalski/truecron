var Promise    = require('bluebird'),
    superagent = require('./sagent'),
    util       = require('util'),
    url        = require('url'),
    expect     = require('expect.js'),
    random     = require("randomstring"),
    config     = require('../lib/config.js'),
    log        = require('../lib/logger.js'),
    testdata   = require('./testdata') ;

var prefix = module.exports.prefix = config.get('API_HOST') || 'http://localhost:3000/api/v1';

function dumpError(res) {
    if (res && res.body && res.body.error) {
        log.debug('Error response: ' + util.inspect(res.body.error));
    }
    return res;
}

var oauthTokenUrl = module.exports.oauthTokenUrl = url.resolve(config.get('API_HOST'), '/oauth/token');
var defaultUserEmail = config.get('TEST_DEFAILT_USER_EMAIL') || testdata.system.email; // authenticate as SYSTEM user if not specified
var clientId = module.exports.clientId = config.get('TEST_CLIENT_ID') || -2;
var clientSecret = module.exports.clientSecret = config.get('TEST_CLIENT_SECRET') || 'Igd7en1_VCMP59pBpmEF';

/**
 * Gets OAuth access token for the specified user (email). It uses our own "Google" grant type for people already
 * authenticated via Google. You basically pass an email of an existing user and you get a token. No password or other checks.
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

module.exports.getAccessTokenWithPassword = Promise.method(function(userEmail, password, callback) {
    return superagent.post(oauthTokenUrl)
            .type('application/x-www-form-urlencoded')
            .send('grant_type=password')
            .send('username=' + userEmail)
            .send('password=' + password)
            .auth(clientId.toString(), clientSecret)
            .endAsync()
        .then(dumpError)
        .nodeify(callback);
});


module.exports.createUser = Promise.method(function createUser(accessToken, done) {
    return superagent.post(prefix + '/users')
            .set('Content-Type', 'application/json')
            .send({ 'user': {'name': "Alice", 'password': "P@ssw0rd"} })
            .authenticate(accessToken)
            .endAsync().bind({})
        .then(function (res) {
            dumpError(res);
            if (res.status !== 201) {
                return res;
            }
            this.res = res;
            this.res.body.user.email = random.generate(10) + "@test.com";
            return superagent.post(prefix + '/users/' + res.body.user.id + '/emails')
                .set('Content-Type', 'application/json')
                .send({'email': this.res.body.user.email, 'status': 'active'})
                .authenticate(accessToken)
                .endAsync();
        })
        .then(function(res) {
            dumpError(res);
            return res.status === 201 ? this.res : res;
        })
        .nodeify(done);
});

module.exports.addMember = Promise.method(function addMember(accessToken, orgId, userId, role, done) {
    return superagent.post(prefix + '/organizations/' + orgId + '/members')
            .set('Content-Type', 'application/json')
            .send({ 'member': { 'userId': userId, 'role': role } })
            .authenticate(accessToken)
            .endAsync()
        .then(dumpError)
        .nodeify(done);
});

module.exports.deleteUser = Promise.method(function deleteUser(accessToken, userId, done) {
    return superagent.del(prefix + '/users/' + userId)
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(dumpError)
        .nodeify(done);
});

module.exports.getOrganization = Promise.method(function getOrganization(accessToken, orgId, done) {
    return superagent.get(prefix + '/organizations/' + orgId)
            .set('Content-Type', 'application/json')
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(dumpError)
        .nodeify(done);
});


module.exports.getWorkspace = Promise.method(function getWorkspace(accessToken, orgId, workspaceId, done) {
    return superagent.get(prefix + '/organizations/' + orgId + '/workspaces/' + workspaceId)
            .set('Content-Type', 'application/json')
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(dumpError)
        .nodeify(done);
});

module.exports.listWorkspaces = Promise.method(function listWorkspaces(accessToken, orgId, query, done) {
    return superagent.get(prefix + '/organizations/' + orgId + '/workspaces')
            .query(query)
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(dumpError)
        .nodeify(done);
});


module.exports.createWorkspace = Promise.method(function createWorkspace(accessToken, orgId, workspaceName, done) {
    return superagent.post(prefix + '/organizations/' + orgId + '/workspaces')
            .set('Content-Type', 'application/json')
            .send({ 'workspace': { 'name': workspaceName } })
            .authenticate(accessToken)
            .endAsync().bind({})
        .then(dumpError)
        .nodeify(done);
});

module.exports.updateWorkspace = Promise.method(function updateWorkspace(accessToken, orgId, workspaceId, attributes, done) {
    return superagent.put(prefix + '/organizations/' + orgId + '/workspaces/' + workspaceId)
            .send(attributes)
            .authenticate(accessToken)
            .endAsync().bind({})
        .then(dumpError)
        .nodeify(done);
});

module.exports.deleteWorkspace = Promise.method(function createWorkspace(accessToken, orgId, workspaceId, done) {
    return superagent.del(prefix + '/organizations/' + orgId + '/workspaces/' + workspaceId)
            .send()
            .authenticate(accessToken)
            .endAsync().bind({})
        .then(dumpError)
        .nodeify(done);
});

