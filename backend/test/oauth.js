var util       = require('util');
var log        = require('../lib/logger.js');
var superagent = require('./sagent');
var expect     = require('expect.js');
var testdata   = require('./testdata');
var api        = require('./api');

describe('OAUTH API',
    function() {
        before(function (done) {
            testdata.initdb(function (err) {
                done(err);
            });
        });

        it('should succeed if password is correct', function (done) {
            api.getAccessTokenWithPassword(testdata.BrianJohnston.email, testdata.BrianJohnston.password)
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.access_token).to.be.a('string');
                    expect(res.body.token_type).to.eql('bearer');
                    done();
                });
        });

        it('should return 400 and invalid_grant if password is invalid', function (done) {
            api.getAccessTokenWithPassword(testdata.BrianJohnston.email, testdata.BrianJohnston.password + '123')
                .then(function (res) {
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql('invalid_grant');
                    done();
                });
        });

        it('should return 400 and invalid_grant if password is not specified', function (done) {
            api.getAccessTokenWithPassword(testdata.BrianJohnston.email, null)
                .then(function (res) {
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql('invalid_grant');
                    done();
                });
        });

        it('should return 400 and invalid_grant if a user does not exist', function (done) {
            api.getAccessTokenWithPassword('non@existent.user', 'P@ssw0rd')
                .then(function (res) {
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql('invalid_grant');
                    done();
                });
        });

        it('should return 400 and invalid_request if a user is not specified', function (done) {
            api.getAccessTokenWithPassword(null, null)
                .then(function (res) {
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql('invalid_request');
                    done();
                });
        });

        it('should refresh a token', function (done) {
            api.getAccessTokenWithPassword(testdata.BrianJohnston.email, testdata.BrianJohnston.password)
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.refresh_token).to.be.a('string');
                    return superagent.post(api.oauthTokenUrl)
                        .type('application/x-www-form-urlencoded')
                        .send('grant_type=refresh_token')
                        .send('refresh_token=' + res.body.refresh_token)
                        .auth(api.clientId.toString(), api.clientSecret)
                        .endAsync();
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.access_token).to.be.a('string');
                    expect(res.body.refresh_token).to.be.a('string');
                    return superagent.get(api.prefix + '/users/current')
                        .set('Content-Type', 'application/json')
                        .send()
                        .authenticate(res.body.access_token)
                        .endAsync();
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.user.id).to.eql(testdata.BrianJohnston.id);
                    done();
                });
        });

        it('should fail to refresh an invalid token', function (done) {
            return superagent.post(api.oauthTokenUrl)
                    .type('application/x-www-form-urlencoded')
                    .send('grant_type=refresh_token')
                    .send('refresh_token=INVALIDINVALIDINVALID')
                    .auth(api.clientId.toString(), api.clientSecret)
                    .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql('invalid_grant');
                    done();
                });
        });
    }
);