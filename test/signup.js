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

describe('SIGN UP',
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
    }
);