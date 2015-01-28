var superagent = require('./sagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var api        = require('./api');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

describe('CONNECTIONS API',
    function() {
        var accessToken = null;

        before(function (done) {
            testdata.initdb(function (err) {
                if (err) done(err);
                auth.getAccessToken(testdata.BrianJohnston.email, function (err, token) {
                    if (err) return done(err);
                    accessToken = token;
                    done();
                });
            });
        });

        function expectBodyToEqlConnection(actual, expected) {
            expect(actual.id).to.be.eql(expected.id);
            expect(actual.organizationId).to.be.eql(expected.organizationId);
            expect(actual.connectionTypeId).to.be.eql(expected.connectionTypeId);
            expect(actual.name).to.be.eql(expected.name);
            expect(validator.isDate(actual.createdAt)).to.be.ok();
            expect(validator.isDate(actual.updatedAt)).to.be.ok();
            expect(actual.updatedBy).to.be.eql(testdata.BrianJohnston.id);
            expect(actual.links.self).to.be.eql('/connections/' + expected.id);
            expect(actual.links.history).to.be.eql('/connections/' + expected.id + '/history');
        }
        
        it('should allow to get an existing connection by ID only', function (done) {
            superagent.get(prefix + '/connections/' + testdata.MyFtpConnection.id)
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expectBodyToEqlConnection(res.body.connection, testdata.MyFtpConnection);
                    done();
                });
        });

        it('should allow to get an existing connection by organization and ID', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/connections/' + testdata.MyFtpConnection.id)
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expectBodyToEqlConnection(res.body.connection, testdata.MyFtpConnection);
                    done();
                });
        });

        it('should return 404 when requesting non-existing connection by organization and ID', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/connections/123456789')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(404);
                    expect(res.body.error).to.not.equal(null);
                    expect(res.body.error.status).to.eql(404);
                    done();
                });
        });

        it('should return 404 when requesting non-existing connection by ID only', function (done) {
            superagent.get(prefix + '/connections/123456789')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(404);
                    expect(res.body.error).to.not.equal(null);
                    expect(res.body.error.status).to.eql(404);
                    done();
                });
        });

        it('should not allow other organization users to get an existing connection by ID', function (done) {
            auth.getAccessToken(testdata.SureshKumar.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/connections/' + testdata.MyFtpConnection.id)
                    .set('Content-Type', 'application/json')
                    .send()
                    .authenticate(token)
                    .endAsync()
                    .then(function (res) {
                        expect(res.status).to.eql(403);
                        expect(res.body.error).to.not.equal(null);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });

        it('should allow to find an existing connection by name', function (done) {
            superagent.get(prefix + '/connections')
                    .query({ q: testdata.MyFtpConnection.name })
                    .set('Content-Type', 'application/json')
                    .send()
                    .authenticate(accessToken)
                    .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    var connection = null;
                    res.body.connections.forEach(function (conn) {
                        if (testdata.MyFtpConnection.id == conn.id) {
                            connection = conn;
                        }
                    });
                    expect(connection).to.not.equal(null);
                    expectBodyToEqlConnection(connection, testdata.MyFtpConnection);
                    done();
                });
        });

        it('should return only connections from organizations the current user is a member of', function (done) {
            superagent.get(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    res.body.connections.forEach(function (conn) {
                        expect([testdata.AcmeCorp.id, testdata.BrianPersonal.id]).to.contain(+conn.organizationId);
                    });
                    done();
                });
        });

        it('should return only connections of the specific organization', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/connections')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    res.body.connections.forEach(function (conn) {
                        expect(+conn.organizationId).to.eql(testdata.AcmeCorp.id);
                    });
                    done();
                });
        });

        it('should fail to create a new connection without a name', function (done) {
            superagent.post(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'connection': { 'connectionTypeId': 'testftp', 'organizationId': testdata.AcmeCorp.id  } })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });

        it('should fail to create a new connection without a connection type', function (done) {
            superagent.post(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({
                    'connection': {
                        'name': 'connection: you should never see this name!',
                        'organizationId': testdata.AcmeCorp.id,
                        'settings': '{}'
                    }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });

        it('should fail to create a new connection with invalid connection type', function (done) {
            superagent.post(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({
                    'connection': {
                        'name': 'connection: you should never see this name!',
                        'organizationId': testdata.AcmeCorp.id,
                        'connectionTypeId': 'DOESNOTEXISTDOESNOTEXISTDOESNOTEXIST',
                        'settings': '{}'
                    }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });

        it('should fail to create a new connection without organization ID', function (done) {
            superagent.post(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({
                    'connection': {
                        'name': 'connection: you should never see this name!',
                        'connectionTypeId': 'testftp',
                        'settings': '{}'
                    }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });

        it('should fail to create a new connection in other`s organization (ID)', function (done) {
            superagent.post(prefix + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({
                    'connection': {
                        'name': 'connection: you should never see this name!',
                        'connectionTypeId': 'testftp',
                        'organizationId': testdata.AjaxCorp.id,
                        'settings': '{}'
                    }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(403);
                    expect(res.body.error.status).to.eql(403);
                    done();
                });
        });

        it('should fail to create a new connection in other`s organization (URL)', function (done) {
            superagent.post(prefix + '/organizations/' + testdata.AjaxCorp.id + '/connections')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({
                    'connection': {
                        'name': 'connection: you should never see this name!',
                        'connectionTypeId': 'testftp',
                        'settings': '{}'
                    }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(403);
                    expect(res.body.error.status).to.eql(403);
                    done();
                });
        });

        // TODO: Create
        // TODO: Create permissions
        // TODO: Update
        // TODO: Create permissions
        // TODO: Delete
        // TODO: Create permissions
    }
);