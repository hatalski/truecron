/**
 * Created by Andrew on 22.10.2014.
 */

var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var auth       = require('./auth');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

describe('JOBS API',
    function() {
        var accessToken = null;
        before(function (done) {
            auth.getAccessToken(function (err, token) {
                if (err) return done(err);
                accessToken = token;
                done();
            });
        });
        it('get all jobs', function (done) {
            superagent.get(prefix + '/jobs')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    done();
                });
        });

    }
);