/**
 * Created by vitalihatalski on 10/18/14.
 */
var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('BASE_URL');
prefix         = prefix || 'https://dev.truecron.com';

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
                    //console.dir('body : ' + res.body);
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
                .send({ email: 'vhatalski@naviam.com', password: 'P@ssw0r' })
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
                .send({ email: 'vhatalski2@naviam.com', password: 'P@ssw0rd', sendEmail: false })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    //console.dir(res.body);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    done();
                });
        });

        it('google sign up should success when email and password are valid', function(done) {
            superagent.post(prefix + '/auth/signup')
                .send({
                    email:         'vitali.hatalski@perklab.com',
                    name:          'Vitali Hatalski',
                    extensionData: {
                        provider: 'google',
                        token: 'ya29.5wCicj5L7eK6j6c8sF_3_3yMjiTogCMrinF7kbyQAwqHh3VDq8H6QMQkeLivbOJPahuz1ga3Y4ygpg',
                        circledByCount: 0,
                        displayName: "Vitali Hatalski",
                        domain: "perkslab.com",
                        emails: ["vitali.hatalski@perklab.com"],
                        gender: "male",
                        id: "103895001537651118709",
                        image: {
                            isDefault: true,
                            url: "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50"
                        },
                        isPlusUser: true,
                        kind: "plus#person",
                        language: "en",
                        name: {
                            familyName: "Hatalski",
                            givenName: "Vitali"
                        },
                        objectType: "person",
                        url: "https://plus.google.com/103895001537651118709",
                        verified: false
                    },
                    sendEmail:     false
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.user.avatarUrl).to.eql('https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50');
                    expect(res.body.user.name).to.eql('Vitali Hatalski');
                    expect(res.body.user.extensionData).to.be.an('object');
                    expect(res.body.user.extensionData.provider).to.eql('google');
                    expect(res.body.user.extensionData.displayName).to.eql('Vitali Hatalski');
                    done();
                });
        });

        it('cancel account should work', function(done) {
            superagent.post(prefix + '/auth/cancelaccount')
                .send({ email: 'vhatalski2@naviam.com' })
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
                .send({ email: 'vitali.hatalski@perklab.com' })
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