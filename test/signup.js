/**
 * Created by vitalihatalski on 10/18/14.
 */
var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('BASE_URL') || 'http://localhost:3000';

log.info('BETA SING UP url prefix: ' + prefix);

describe('SIGN UP',
    function() {
        it('beta sign up', function (done) {
            superagent.post(prefix + '/beta/signup')
                .send('email=vitali.hatalski@truecron.com')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(201);
                    done();
                });
        });
    }
);