
var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

describe('RESET PASSWORD API',
    function() {
        var accessToken = null;
        before(function (done) {
            testdata.initdb(function (err) {
                if (err) done(err);
                auth.getAccessToken(function (err, token) {
                    if (err) return done(err);
                    accessToken = token;
                    done();
                });
            });
        });
        it.only('create a new data in DB', function (done) {
            superagent.post('https://dev.truecron.com' + '/auth/resetpassword')
                .set('Content-Type', 'application/json')
                .send({ 'resetpass': {
                    'email': 'ghostxx7@gmail.com'
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.resetpass.email).to.eql('ghostxx7@gmail.com');
                    expect(validator.isDate(res.body.resetpass.createdAt)).to.be.ok();
                    expect(res.status).to.eql(201);
                    done();
                });
        });

    }
);
