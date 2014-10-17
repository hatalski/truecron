/**
 * Created by vitalihatalski on 10/17/14.
 */
var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

describe('USERS API',
    function() {
        var id_to_delete;
        it('create a new user', function (done) {
            superagent.post(prefix + '/users')
                .set('Content-Type', 'application/json')
                .send({ 'user': {'name': "Alice", 'password': "P@ssw0rd"} })
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    id_to_delete = res.body.user.id;
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.user.id).to.be.a('number');
                    expect(res.status).to.eql(201);
                    done();
                });
        });
        it('create a new user with google data', function (done) {
            superagent.post(prefix + '/users')
                .set('Content-Type', 'application/json')
                .send({ 'user': {'name': "vitali.hatalski@truecron.com", 'password': "P@ssw0rd", 'extensionData': '{"email": "vitali.hatalski@truecron.com", "access_token": "12345" }' } })
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.user.id).to.be.a('number');
                    expect(res.status).to.eql(201);
                    done();
                });
        });
        it('get list of users', function (done) {
            superagent.get(prefix + '/users')
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('get list of users with limit 1', function (done) {
            var limit = 1;
            superagent.get(prefix + '/users')
                .query({ limit: limit, offset: 1})
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    console.dir(res.body.users);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.users.length).to.eql(limit);
                    expect(res.body.meta.total).to.be.a('number');
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('get user by id', function (done) {
            superagent.get(prefix + '/users/' + id_to_delete)
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.user.id).to.be.a('number');
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('update user', function (done) {
            superagent.put(prefix + '/users/' + id_to_delete)
                .send({ 'user': {'name': "Alice", 'password': "UpdatedP@ssw0rd"} })
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.user.id).to.be.a('number');
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('delete user', function (done) {
            superagent.del(prefix + '/users/' + id_to_delete)
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(204);
                    done();
                });
        });
    }
);