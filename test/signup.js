/**
 * Created by vitalihatalski on 10/18/14.
 */
var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('BASE_URL') + ':' + config.get('PORT');
prefix         = prefix || 'http://localhost:3000';

log.info('BETA SING UP url prefix: ' + prefix);

describe('BETA SIGN UP',
    function() {
        it('beta sign up', function (done) {
            superagent.post(prefix + '/beta/signup')
                .send({'email': 'vitali.hatalski@truecron.com', 'test': true })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.message).to.eql('Thanks for signing up! Share this page to spread the word!');
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('beta sign up without email should fail', function (done) {
            superagent.post(prefix + '/beta/signup')
                .send({'email': '', 'test': true })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    //expect(res.body.message).to.eql('Incorrect Email!');
                    expect(res.status).to.eql(400);
                    done();
                });
        });

        it('beta sign up with incorrect email should fail', function (done) {
            superagent.post(prefix + '/beta/signup')
                .send({ email: '', test: true })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    //expect(res.body.message).to.eql('Incorrect Email!');
                    done();
                });
        });
    }
);

describe('REAL SIGN UP',
    function() {
        it('sign up should fail if email is invalid', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({ email: 'invalid', password: 'P@ssw0rd'})
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    console.dir('body : ' + res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    expect(res.body.error.message).to.eql('Invalid parameters. The email address you entered is not valid. Please try again.');
                    done();
                });
        });

        it('sign up should fail if email is empty', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({ email: '', password: 'P@ssw0rd'})
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    expect(res.body.error.message).to.eql('Invalid parameters. The email address you entered is not valid. Please try again.');
                    done();
                });
        });

        //it.skip('sign up should fail if email length is invalid', function(done) {
        //    superagent.post(prefix + '/auth/signup')
        //        // 262 chars when 256 is max
        //        .send({password: 'P@ssw0rd', 'email': '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890@example.com'})
        //        .end(function (e, res) {
        //            expect(e).to.eql(null);
        //            expect(res.status).to.eql(400);
        //            expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
        //            expect(res.body.error).to.be.an('object');
        //            expect(res.body.error.status).to.eql(400);
        //            expect(res.body.error.message).to.eql('Invalid parameters. The email address you entered is not valid. Please try again.');
        //            done();
        //        });
        //});

        it('sign up should fail if email is already taken', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({ email: 'bj@it.acme.corp', password: 'P@ssw0rd'})
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    expect(res.body.error.message).to.eql('Invalid parameters. The email address is already taken. Please choose another one.');
                    done();
                });
        });

        it('sign up should fail if password length is less than 8 characters', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({ email: 'vhatalski@naviam.com', password: 'P@ssw0r'})
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    expect(res.body.error.message).to.eql('Invalid parameters. The password should be minimum of 8 characters in length.');
                    done();
                });
        });

        it('sign up should success when email and password are valid', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({ email: 'vhatalski@naviam.com', password: 'P@ssw0rd' })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    done();
                });
        });

        it('cancel account should work', function(done) {
            superagent.post(prefix + '/auth/cancelaccount')
                .send({ email: 'vhatalski@naviam.com' })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    done();
                });
        });
    }
);