var Promise    = require('bluebird'),
    superagent = require('./sagent'),
    util       = require('util'),
    expect     = require('expect.js'),
    random     = require("randomstring"),
    url        = require('url'),
    config     = require('../lib/config.js'),
    log        = require('../lib/logger.js');

var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

function dumpError(res) {
    if (res && res.body && res.body.error) {
        log.debug('Error response: ' + util.inspect(res.body.error));
    }
}

module.exports.createUser = Promise.method(function createUser(accessToken, done) {
    return superagent.post(prefix + '/users')
            .set('Content-Type', 'application/json')
            .send({ 'user': {'name': "Alice", 'password': "P@ssw0rd"} })
            .authenticate(accessToken)
            .endAsync().bind({})
        .then(function (res) {
            dumpError(res);
            expect(res.status).to.eql(201);
            expect(res.body.user.id).to.be.a('string');
            this.userId = res.body.user.id;
            this.email = random.generate(10) + "@test.com";
            return superagent.post(prefix + '/users/' + this.userId + '/emails')
                .set('Content-Type', 'application/json')
                .send({'email': this.email, 'status': 'active'})
                .authenticate(accessToken)
                .endAsync();
        })
        .then(function(res) {
            expect(res.status).to.eql(201);
            return { id: this.userId, email: this.email };
        })
        .nodeify(done);
});

module.exports.addMember = Promise.method(function addMember(accessToken, orgId, userId, role, done) {
    return superagent.post(prefix + '/organizations/' + orgId + '/members')
            .set('Content-Type', 'application/json')
            .send({ 'member': { 'userId': userId, 'role': role } })
            .authenticate(accessToken)
            .endAsync()
        .then(function (res) {
            dumpError(res);
            expect(res.status).to.eql(201);
            expect(res.body.member.userId).to.be.a('string');
            return res.body.member;
        })
        .nodeify(done);
});

module.exports.deleteUser = Promise.method(function deleteUser(accessToken, userId, done) {
    return superagent.del(prefix + '/users/' + userId)
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(function (res) {
            dumpError(res);
            expect(res.body.error).to.eql(undefined);
            expect(res.status).to.eql(204);
        })
        .nodeify(done);
});

module.exports.getOrganization = Promise.method(function deleteUser(accessToken, orgId, done) {
    return superagent.get(prefix + '/organizations/' + orgId)
            .set('Content-Type', 'application/json')
            .send()
            .authenticate(accessToken)
            .endAsync()
        .then(function (res){
            dumpError(res);
            return res;
        })
        .nodeify(done);
});