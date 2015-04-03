var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

var id_task_to_delete;

describe('TASK API',
    function() {
        var accessToken = null;
        var JOB_URL = prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id
            + '/jobs/' + testdata.MyWorkspaceTestJob.id;

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

        it('create a new task', function (done) {
            superagent.post(JOB_URL + '/tasks')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'task': {
                    "name": "TaskTestname",
                    "active": 1,
                    "taskTypeId": testdata.TestTaskType.id,
                    "position": 1,
                    "settings": {
                        "target": "mycompany.com",
                        "connection": null,
                        "count": 5,
                        "ttl": null,
                        "timeout": null,
                        "size": null
                    },
                    "timeout": "10"
                }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(201);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    id_task_to_delete = res.body.task.id;
                    expect(res.body.task.id).to.be.a('string');
                    expect(res.body.task.name).to.eql('TaskTestname');
                    expect(res.body.task.taskTypeId).to.eql(testdata.TestTaskType.id);
                    expect(res.body.task.position).to.eql(1);
                    expect(res.body.task.settings.target).to.eql('mycompany.com');
                    expect(res.body.task.timeout).to.eql(10);
                    expect(validator.isDate(res.body.task.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.task.updatedAt)).to.be.ok();
                    done();
                });
        });

        it('get all tasks', function (done) {
            superagent.get(JOB_URL + '/tasks')
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

        it('get task by id', function (done) {
            superagent.get(JOB_URL + '/tasks/' + id_task_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.task.id).to.be.a('string');
                    expect(validator.isDate(res.body.task.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.task.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(200);
                    done();
                });
        });

        it('update task', function (done) {
            superagent.put(JOB_URL + '/tasks/' + id_task_to_delete)
                .set('Content-Type', 'application/json')
                .send({ "task":  {
                    "name": "UpdatedTaskTestname",
                    "active": 0,
                    "position": 110,
                    "settings": {
                        "target": "Updated mycompany.com",
                        "connection": null,
                        "count": 15,
                        "size": null
                    },
                    "timeout": 101
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.task.name).to.eql('UpdatedTaskTestname');
                    expect(res.body.task.active).to.eql(0);
                    expect(res.body.task.position).to.eql(110);
                    expect(res.body.task.settings.target).to.eql('Updated mycompany.com');
                    expect(res.body.task.settings.count).to.eql(15);
                    expect(res.body.task.timeout).to.eql(101);
                    expect(res.status).to.eql(200);
                    done();
                });
        });

        it('delete task', function (done) {
            superagent.del(JOB_URL + '/tasks/' + id_task_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(204);
                    done();
                });
        });

        it('create a new task attributes only jobID', function (done) {
            superagent.post(prefix + '/tasks')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'task': {
                    "jobId" : testdata.MyWorkspaceTestJob.id,
                    "name": "TaskTestname",
                    "active": 1,
                    "taskTypeId": testdata.TestTaskType.id,
                    "position": 1,
                    "settings": {
                        "target": "mycompany.com",
                        "connection": null,
                        "count": 5,
                        "ttl": null,
                        "timeout": null,
                        "size": null
                    },
                    "timeout": "10"
                }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(201);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    id_task_to_delete = res.body.task.id;
                    expect(res.body.task.id).to.be.a('string');
                    expect(res.body.task.name).to.eql('TaskTestname');
                    expect(res.body.task.taskTypeId).to.eql(testdata.TestTaskType.id);
                    expect(res.body.task.position).to.eql(1);
                    expect(res.body.task.settings.target).to.eql('mycompany.com');
                    expect(res.body.task.timeout).to.eql(10);
                    expect(validator.isDate(res.body.task.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.task.updatedAt)).to.be.ok();
                    done();
                });
        });
        it('delete task attributes only jobID', function (done) {
            superagent.del(JOB_URL + '/tasks/' + id_task_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(204);
                    done();
                });
        });

    }
);