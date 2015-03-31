var superagent = require('./sagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var api        = require('./api');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

describe('WORKSPACES API',
    function() {
        var accessToken = null;

        before(function (done) {
            testdata.initdb(function (err) {
                if (err) done(err);
                auth.getAccessToken(testdata.BrianJohnston.email, function (err, token) {
                    if (err) return done(err);
                    accessToken = token;
                    done();
                });
            });
        });

        it('should allow to get an existing workspace by organization and ID', function (done) {
            api.getWorkspace(accessToken, testdata.AcmeCorp.id, testdata.MyWorkspace.id)
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    log.info(res.body.workspace);
                    expect(res.body.workspace.id).to.be.eql(testdata.MyWorkspace.id);
                    expect(res.body.workspace.organizationId).to.be.eql(testdata.AcmeCorp.id);
                    expect(res.body.workspace.name).to.be.eql(testdata.MyWorkspace.name);
                    expect(validator.isDate(res.body.workspace.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.workspace.updatedAt)).to.be.ok();
                    expect(res.body.workspace.updatedBy).to.be.eql(testdata.BrianJohnston.id);
                    expect(res.body.workspace.links.self).to.be.eql('/workspaces/' + testdata.MyWorkspace.id);
                    expect(res.body.workspace.links.jobs).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/jobs');
                    expect(res.body.workspace.links.history).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/history');
                    done();
                });
        });

        it('should allow to get an existing workspace by ID only', function (done) {
            superagent.get(prefix + '/workspaces/' + testdata.MyWorkspace.id)
                    .set('Content-Type', 'application/json')
                    .send()
                    .authenticate(accessToken)
                    .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.workspace.id).to.be.eql(testdata.MyWorkspace.id);
                    expect(res.body.workspace.organizationId).to.be.eql(testdata.AcmeCorp.id);
                    expect(res.body.workspace.name).to.be.eql(testdata.MyWorkspace.name);
                    expect(validator.isDate(res.body.workspace.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.workspace.updatedAt)).to.be.ok();
                    expect(res.body.workspace.updatedBy).to.be.eql(testdata.BrianJohnston.id);
                    expect(res.body.workspace.links.self).to.be.eql('/workspaces/' + testdata.MyWorkspace.id);
                    expect(res.body.workspace.links.jobs).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/jobs');
                    expect(res.body.workspace.links.history).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/history');
                    done();
                });
        });

        it('should allow to find an existing workspace by name', function (done) {
            api.listWorkspaces(accessToken, testdata.AcmeCorp.id, { q: testdata.MyWorkspace.name })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    var workspace = null;
                    res.body.workspaces.forEach(function (ws) {
                        console.dir(ws);
                        if (testdata.MyWorkspace.id == ws.id) {
                            workspace = ws;
                        }
                    });
                    expect(workspace).to.not.equal(null);
                    expect(workspace.id).to.be.eql(testdata.MyWorkspace.id);
                    expect(workspace.name).to.be.eql(testdata.MyWorkspace.name);
                    expect(validator.isDate(workspace.createdAt)).to.be.ok();
                    expect(validator.isDate(workspace.updatedAt)).to.be.ok();
                    expect(workspace.updatedBy).to.be.eql(testdata.BrianJohnston.id);
                    expect(workspace.links.self).to.be.eql('/workspaces/' + testdata.MyWorkspace.id);
                    expect(workspace.links.jobs).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/jobs');
                    expect(workspace.links.history).to.be.eql('/workspaces/' + testdata.MyWorkspace.id + '/history');
                    done();
                });
        });

        it('should not allow other organization users to get an existing workspace by ID', function (done) {
            api.getAccessToken(testdata.SureshKumar.email)
                .then(function (sureshToken) {
                    return api.getWorkspace(sureshToken, testdata.AcmeCorp.id, testdata.MyWorkspace.id);
                })
                .then(function (res) {
                    expect(res.status).to.eql(403);
                    done();
                });
        });

        it('should fail to create a new workspace without a name', function (done) {
            superagent.post(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'workspace': { } })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });

        it('should create a new workspace, find it and delete it', function (done) {
            var workspaceName = random.generate(10) + ' Workspace',
                workspaceId = null;
            api.createWorkspace(accessToken, testdata.AcmeCorp.id, workspaceName)
                .then(function (res) {
                    console.dir(res.body);
                    expect(res.status).to.eql(201);
                    workspaceId = res.body.workspace.id;
                    expect(res.body.workspace.organizationId).to.eql(testdata.AcmeCorp.id);
                    expect(res.body.workspace.name).to.eql(workspaceName);
                    expect(validator.isDate(res.body.workspace.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.workspace.updatedAt)).to.be.ok();
                    expect(res.body.workspace.updatedBy).to.eql(testdata.BrianJohnston.id);
                    expect(res.body.workspace.links.self).to.eql('/workspaces/' + res.body.workspace.id);
                    expect(res.body.workspace.links.jobs).to.eql('/workspaces/' + res.body.workspace.id + '/jobs');
                    expect(res.body.workspace.links.history).to.eql('/workspaces/' + res.body.workspace.id + '/history');

                    return api.getWorkspace(accessToken, testdata.AcmeCorp.id, res.body.workspace.id);
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.workspace.id).to.eql(workspaceId);
                    expect(res.body.workspace.name).to.eql(workspaceName);
                    return api.deleteWorkspace(accessToken, testdata.AcmeCorp.id, res.body.workspace.id);
                })
                .then(function(res) {
                    expect(res.status).to.eql(204);
                    return api.listWorkspaces(accessToken, testdata.AcmeCorp.id, {q: workspaceName});
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.meta.total).to.eql(0);
                    done();
                });
        });

        it('should update a workspace', function (done) {
            var name1 = random.generate(10) + ' Workspace',
                name2 = random.generate(10) + ' Workspace';
            api.createWorkspace(accessToken, testdata.AcmeCorp.id, name1)
                .then(function (res) {
                    expect(res.status).to.eql(201);
                    expect(res.body.workspace.name).to.be.eql(name1);
                    return api.updateWorkspace(accessToken, testdata.AcmeCorp.id, res.body.workspace.id, { workspace: {name: name2 }});
                })
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.workspace.name).to.be.eql(name2);
                    return api.deleteWorkspace(accessToken, testdata.AcmeCorp.id, res.body.workspace.id);
                })
                .then(function(res) {
                    expect(res.status).to.eql(204);
                    done();
                });
        });

        it('should not allow viewers to update a workspace', function (done) {
            api.getAccessToken(testdata.IvanPetrov.email)
                .then(function (petrovToken) {
                    return api.updateWorkspace(accessToken, testdata.AjaxCorp.id, testdata.StagingWorkspace.id, { workspace: {name: random.generate(10) + ' Workspace' }});
                })
                .then(function (res) {
                    expect(res.status).to.eql(403);
                    done();
                });
        });
    }
);