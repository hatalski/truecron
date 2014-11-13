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
var testdata   = require('./testdata');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

var workspaceIdMaster=-12;

log.info('API tests prefix: ' + prefix);

describe('TASK API',
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
        var id_to_delete;
        it('create a new job', function (done) {
            superagent.post(prefix + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'workspaceId':workspaceIdMaster,
                    'name': 'TestName',
                    'tags': ["edi", "production"],
                    'updatedByPersonId':'-1',
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
        var taskId_to_delete;
//        it('create a new task', function (done) {
//            superagent.post(prefix + '/jobs/'+id_to_delete+'/tasks/')
//                .set('Content-Type', 'application/json')
//                .send({ 'task': {
//                        'jobId': id_to_delete,
//                        'name': 'TestNameTask',
//                        'position': 1,
//                        'taskTypeId': 2,
//                        'settings': {
//                            "target": "mycompany.com",
//                            "connection": null,
//                            "count": 5,
//                            "ttl": null,
//                            "timeout": null,
//                            "size": null
//                            },
//                    'timeout': '10',
//                    'updatedByPersonId':'-1'
//                    }
//                })
//                .authenticate(accessToken)
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    //taskId_to_delete = res.body.task.id;
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });

//        it('get all tasks', function (done) {
//            superagent.get(prefix + '/jobs/'+id_to_delete+'/tasks')
//                .set('Content-Type', 'application/json')
//                .send()
//                .authenticate(accessToken)
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.status).to.eql(200);
//                    done();
//                });
//        });
//
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