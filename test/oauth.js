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
    }
);