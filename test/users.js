///**
// * Created by vitalihatalski on 10/17/14.
// */
//var superagent = require('superagent');
//var expect     = require('expect.js');
//var validator  = require('validator');
//var random     = require("randomstring");
//var config     = require('../lib/config.js');
//var log        = require('../lib/logger.js');
//var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';
//
//log.info('API tests prefix: ' + prefix);
//
//superagent.Request.prototype.authenticate = function() {
//    return this.auth('-2', 'Igd7en1_VCMP59pBpmEF');
//};
//
//describe('USERS API',
//    function() {
//        var id_to_delete;
//        it('create a new user without required name should fail', function (done) {
//            superagent.post(prefix + '/users')
//                .set('Content-Type', 'application/json')
//                .send({ 'user': { 'password': "P@ssw0rd"} })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.be.an('object');
//                    expect(res.body.error.status).to.eql(400);
//                    expect(res.body.error.message).to.eql("Invalid parameters. Error: Invalid parameters");
//                    expect(res.status).to.eql(400);
//                    done();
//                });
//        });
//        it('create a new user without required password should fail', function (done) {
//            superagent.post(prefix + '/users')
//                .set('Content-Type', 'application/json')
//                .send({ 'user': { 'password': "P@ssw0rd"} })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.be.an('object');
//                    expect(res.body.error.status).to.eql(400);
//                    expect(res.body.error.message).to.eql("Invalid parameters. Error: Invalid parameters");
//                    expect(res.status).to.eql(400);
//                    done();
//                });
//        });
//        it('create a new user', function (done) {
//            superagent.post(prefix + '/users')
//                .set('Content-Type', 'application/json')
//                .send({ 'user': {'name': "Alice", 'password': "P@ssw0rd"} })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    id_to_delete = res.body.user.id;
//                    expect(res.body.user.id).to.be.a('string');
//                    expect(res.body.user.name).to.eql('Alice');
//                    expect(res.body.user.password).to.eql(undefined);
//                    expect(res.body.user.passwordHash).to.eql(undefined);
//                    expect(validator.isDate(res.body.user.createdAt)).to.be.ok();
//                    expect(validator.isDate(res.body.user.updatedAt)).to.be.ok();
//                    // expect(res.body.user.extensionData).to.be(undefined); TODO: on vagrant it returns null, on codeship undefined.
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });
//        it('create a new user with google data', function (done) {
//            superagent.post(prefix + '/users')
//                .set('Content-Type', 'application/json')
//                .send({ 'user': {'name': "vitali.hatalski@truecron.com", 'password': "P@ssw0rd", 'extensionData': '{"email": "vitali.hatalski@truecron.com", "access_token": "12345" }' } })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.user.id).to.be.a('string');
//                    expect(res.body.user.name).to.eql('vitali.hatalski@truecron.com');
//                    expect(res.body.user.password).to.eql(undefined);
//                    expect(res.body.user.passwordHash).to.eql(undefined);
//                    expect(validator.isDate(res.body.user.createdAt)).to.be.ok();
//                    expect(validator.isDate(res.body.user.updatedAt)).to.be.ok();
//                    expect(res.body.user.extensionData.email).to.eql('vitali.hatalski@truecron.com');
//                    expect(res.body.user.extensionData.access_token).to.eql('12345');
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });
//        it('get list of users', function (done) {
//            superagent.get(prefix + '/users')
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.users.length).to.be.greaterThan(1);
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('get list of users with limit 1', function (done) {
//            var limit = 1;
//            superagent.get(prefix + '/users')
//                .query({ limit: limit, offset: 1})
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.users).to.have.length(limit);
//                    expect(res.body.meta.total).to.be.a('number');
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('get user by id', function (done) {
//            superagent.get(prefix + '/users/' + id_to_delete)
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.user.id).to.be.a('string');
//                    expect(validator.isDate(res.body.user.createdAt)).to.be.ok();
//                    expect(validator.isDate(res.body.user.updatedAt)).to.be.ok();
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('update user', function (done) {
//            superagent.put(prefix + '/users/' + id_to_delete)
//                .set('Content-Type', 'application/json')
//                .send({ 'user': {'name': "Tom", 'password': "UpdatedP@ssw0rd"} })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.user.id).to.be.a('string');
//                    expect(res.body.user.name).to.eql('Tom');
//                    expect(res.body.user.password).to.eql(undefined);
//                    expect(res.body.user.passwordHash).to.eql(undefined);
//                    expect(validator.isDate(res.body.user.createdAt)).to.be.ok();
//                    expect(validator.isDate(res.body.user.updatedAt)).to.be.ok();
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('update user without post data should fail', function (done) {
//            superagent.put(prefix + '/users/' + id_to_delete)
//                .set('Content-Type', 'application/json')
//                .send({})
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.be.an('object');
//                    expect(res.body.error.status).to.eql(400);
//                    expect(res.body.error.message).to.eql("Invalid parameters");
//                    expect(res.status).to.eql(400);
//                    done();
//                });
//        });
//        it('add email to user with empty body should fail', function (done) {
//            superagent.post(prefix + '/users/' + id_to_delete + '/emails')
//                .set('Content-Type', 'application/json')
//                .send({})
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.be.an('object');
//                    expect(res.body.error.status).to.eql(400);
//                    expect(res.body.error.message).to.eql("Invalid parameters");
//                    expect(res.status).to.eql(400);
//                    done();
//                });
//        });
//        it('add email to user with invalid email should fail', function (done) {
//            superagent.post(prefix + '/users/' + id_to_delete + '/emails')
//                .set('Content-Type', 'application/json')
//                .send({ 'email': 'invalid@email'})
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.be.an('object');
//                    expect(res.body.error.status).to.eql(400);
//                    expect(res.body.error.message).to.eql("Invalid parameters. Invalid email");
//                    expect(res.status).to.eql(400);
//                    done();
//                });
//        });
//        var email_id_to_delete;
//        var random_email = random.generate(10) + "@truecron.com";
//        it('add email to user', function (done) {
//            superagent.post(prefix + '/users/' + id_to_delete + '/emails')
//                .set('Content-Type', 'application/json')
//                .send({ 'email': random_email })
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    email_id_to_delete = res.body.email.id;
//                    expect(res.body.email.id).to.be.a('string');
//                    expect(res.body.email.email).to.eql(random_email.toLowerCase()); // we store emails in lowercase
//                    expect(res.body.email.status).to.eql('pending');
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });
//        it('get user email by id', function (done) {
//            superagent.get(prefix + '/users/' + id_to_delete + '/emails/' + email_id_to_delete)
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.email.id).to.be.a('string');
//                    expect(res.body.email.email).to.eql(random_email.toLowerCase()); // we store emails in lowercase
//                    expect(res.body.email.status).to.eql('pending');
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('get all user emails', function (done) {
//            superagent.get(prefix + '/users/' + id_to_delete + '/emails')
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.emails).to.have.length(1);
//                    expect(res.body.meta.total).to.be.a('number');
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('get user by email', function (done) {
//            superagent.get(prefix + '/users/' + random_email)
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.body.user.id).to.be.a('string');
//                    expect(validator.isDate(res.body.user.createdAt)).to.be.ok();
//                    expect(validator.isDate(res.body.user.updatedAt)).to.be.ok();
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//        it('delete user email', function (done) {
//            superagent.del(prefix + '/users/' + id_to_delete + '/emails/' + email_id_to_delete)
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.status).to.eql(204);
//                    done();
//                });
//        });
//        it('delete user', function (done) {
//            superagent.del(prefix + '/users/' + id_to_delete)
//                .send()
//                .authenticate()
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.body.error).to.eql(undefined);
//                    expect(res.status).to.eql(204);
//                    done();
//                });
//        });
//    }
//);