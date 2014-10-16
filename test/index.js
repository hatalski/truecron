var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

describe('USERS API',
    function() {
        it('create a new user', function (done) {
            superagent.post(prefix + '/users')
                .set('Content-Type', 'application/json')
                .send({ "user": {"name": "Alice", "password": "P@ssw0rd"} })
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(null);
                    expect(res.status).to.eql(201);
                    done();
                });
        });
        it('get user by id', function (done) {
            superagent.get(prefix + '/users/1')
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(null);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
    }
);