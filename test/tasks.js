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
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

var taskTypeId=-100;
var updatedByPersonId=-1;
var id_to_delete;
var workspaceIdMaster=-12;
var id_task_to_delete;

describe('TASK API',
    function() {
        var accessToken = null;
        var orgName = random.generate(10) + ' Corp';

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

        it('create a new job', function (done) {
            superagent.post(prefix + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'workspaceId':workspaceIdMaster,
                    'name': 'TestName',
                    'tags': ["edi", "production"],
                    'updatedByPersonId':updatedByPersonId,
                    'startsAt': '2014-08-21T10:00:11Z',
                    'rrule': 'FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    id_to_delete = res.body.job.id;
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('create a new task', function (done) {
            superagent.post(prefix + '/jobs/'+id_to_delete+'/tasks')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'task': {
                    "name": "TaskTestname",
                    "jobId": id_to_delete,
                    "active": 1,
                    "taskTypeId": taskTypeId,
                    "position": 1,
                    "settings": {
                        "target": "mycompany.com",
                        "connection": null,
                        "count": 5,
                        "ttl": null,
                        "timeout": null,
                        "size": null
                    },
                    "updatedByPersonId": updatedByPersonId,
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
                    expect(validator.isDate(res.body.task.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.task.updatedAt)).to.be.ok();
                    done();
                });
        });

        it('get all tasks', function (done) {
            superagent.get(prefix + '/jobs/'+id_to_delete+'/tasks')
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
            superagent.get(prefix + '/jobs/' + id_to_delete+'/tasks/'+id_task_to_delete)
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

        id_to_delete=99;
        id_task_to_delete=4;

        //it('update task', function (done) {
        //    superagent.put(prefix + '/jobs/' + id_to_delete+'/tasks/'+id_task_to_delete)
        //        .set('Content-Type', 'application/json')
        //        .send({ 'task':  {
        //
        //            'position': 10
        //        }
        //        })
        //        .authenticate(accessToken)
        //        .end(function (e, res) {
        //            expect(e).to.eql(null);
        //            expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
        //            //expect(validator.isDate(res.body.task.startsAt)).to.be.ok();
        //            expect(res.status).to.eql(200);
        //            done();
        //        });
        //});

        it('delete task', function (done) {
            superagent.del(prefix + '/jobs/' + id_to_delete+'/tasks/'+id_task_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(204);
                    done();
                });
        });

        it('delete job', function (done) {
            superagent.del(prefix + '/jobs/'+ id_to_delete)
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