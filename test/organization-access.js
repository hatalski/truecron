var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../backend/context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var api        = require('./api');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

describe('ORGANIZATIONS ACCESS',
    function() {
        before(testdata.initdb);

        it('must return access denied when a user gets an organization by ID he has no access', function (done) {
            auth.getAccessToken(testdata.BrianJohnston.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .set('Content-Type', 'application/json')
                    .send()
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(403);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });
        it('should not list an organization if a user has no access to it', function (done) {
            auth.getAccessToken(testdata.BrianJohnston.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/organizations')
                    .send()
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(200);
                        res.body.organizations.forEach(function (row) {
                            expect(row.organization.name).not.to.eql(testdata.AjaxCorp.name);
                        });
                        done();
                    });
            });
        });
        it('should not find an organization if a user has no access to it', function (done) {
            auth.getAccessToken(testdata.BrianJohnston.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/organizations')
                    .query({ q: testdata.AjaxCorp.name })
                    .send()
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(200);
                        res.body.organizations.forEach(function (row) {
                            expect(row.organization.name).not.to.eql(testdata.AjaxCorp.name);
                        });
                        done();
                    });
            });
        });
        it('should return access denied when a user edits an organization he has no access', function (done) {
            auth.getAccessToken(testdata.SureshKumar.email, function (err, token) {
                if (err) return done(err);
                superagent.put(prefix + '/organizations/' + testdata.AcmeCorp.id)
                    .set('Content-Type', 'application/json')
                    .send({ 'organization': {'name': 'You should not see this string, fix the test!' } })
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(403);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });
        it('should return access denied when a user deletes an organization he has no access', function (done) {
            auth.getAccessToken(testdata.SureshKumar.email, function (err, token) {
                if (err) return done(err);
                superagent.del(prefix + '/organizations/' + testdata.AcmeCorp.id)
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(403);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });
        it('should allow an admin to get an organization by ID', function (done) {
            auth.getAccessToken(testdata.SureshKumar.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.organization.id).to.eql(testdata.AjaxCorp.id);
                        expect(res.body.organization.name).to.eql(testdata.AjaxCorp.name);
                        expect(res.body.organization.email).to.eql(testdata.AjaxCorp.email);
                        done();
                    });
            });
        });
        it('should allow a member to get an organization by ID', function (done) {
            auth.getAccessToken(testdata.IvanPetrov.email, function (err, token) {
                if (err) return done(err);
                superagent.get(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.organization.id).to.eql(testdata.AjaxCorp.id);
                        done();
                    });
            });
        });
        it('should allow an admin to edit an organization', function (done) {
            auth.getAccessToken(testdata.SureshKumar.email, function (err, token) {
                if (err) return done(err);
                superagent.put(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .set('Content-Type', 'application/json')
                    .send({ 'organization': {'name': testdata.AjaxCorp.name } })
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(200);
                        expect(res.body.organization.name).to.eql(testdata.AjaxCorp.name);
                        expect(res.body.organization.updatedByPersonId).to.eql(testdata.SureshKumar.id);
                        done();
                    });
            });
        });
        it('should not allow a member to edit an organization', function (done) {
            auth.getAccessToken(testdata.IvanPetrov.email, function (err, token) {
                if (err) return done(err);
                superagent.put(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .set('Content-Type', 'application/json')
                    .send({ 'organization': {'name': testdata.AjaxCorp.name } })
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(403);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });
        it('should not allow a member to delete an organization', function (done) {
            auth.getAccessToken(testdata.IvanPetrov.email, function (err, token) {
                if (err) return done(err);
                superagent.del(prefix + '/organizations/' + testdata.AjaxCorp.id)
                    .authenticate(token)
                    .end(function (e, res) {
                        expect(e).to.eql(null);
                        expect(res.status).to.eql(403);
                        expect(res.body.error.status).to.eql(403);
                        done();
                    });
            });
        });
        it('should not allow a new user to get an organization by ID', function (done) {
            auth.getAccessToken(testdata.system.email).bind({})
                .then(function (systemToken) {
                    this.systemToken = systemToken;
                    return api.createUser(systemToken);
                })
                .then(function (user) {
                    this.user = user;
                    return auth.getAccessToken(user.email);
                })
                .then(function (userToken) {
                    return api.getOrganization(userToken, testdata.AjaxCorp.id);
                })
                .then(function (res) {
                    expect(res.status).to.eql(403);
                })
                .finally(function(){
                    if (this.user) {
                        api.deleteUser(this.systemToken, this.user.id).then(done);
                    } else {
                        done();
                    }
                });
        });
        it('should allow a new member to get an organization by ID', function (done) {
            auth.getAccessToken(testdata.system.email).bind({})
                .then(function (systemToken) {
                    this.systemToken = systemToken;
                    return api.createUser(systemToken);
                })
                .then(function (user) {
                    this.user = user;
                    return api.addMember(this.systemToken, testdata.AjaxCorp.id, user.id, 'member');
                })
                .then(function () {
                    return auth.getAccessToken(this.user.email);
                })
                .then(function (userToken) {
                    return api.getOrganization(userToken, testdata.AjaxCorp.id);
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.organization.name).to.eql(testdata.AjaxCorp.name);
                })
                .finally(function() {
                    if (this.user) {
                        return api.deleteUser(this.systemToken, this.user.id).then(done);
                    } else {
                        done();
                    }
                });
        });
    }
);