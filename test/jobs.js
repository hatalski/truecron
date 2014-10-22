/**
 * Created by Andrew on 22.10.2014.
 */

var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

superagent.Request.prototype.authenticate = function() {
    return this.auth('-2', 'Igd7en1_VCMP59pBpmEF');
};

describe('JOBS API',
    function() {
        it('get all jobs', function (done) {
            superagent.post(prefix + '/jobs')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate()
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    done();
                });
        });

    }
);