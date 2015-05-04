
var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

var taskTypeId=-100;
var updatedByPersonId=-1;
var organizationIdMaster=testdata.AcmeCorp.id;
var workspaceIdMaster=testdata.MyWorkspace.id;
var id_task_to_delete;
var id_run_to_delete;
var testDataIdJob=-222;

describe('JOBSCounters API',
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
        var id_to_delete1;

        it('create a new job with jobcounter', function (done) {
            superagent.post(prefix + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'name': 'TestName3',
                    'active': 1,
                    'archived': 0,
                    'tags': ["tag1", "tag2"],
                    'schedule': {
                        'dtStart': '2014-08-21T10:00:11Z',
                        'rrule': 'FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                    }
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    id_to_delete1 = res.body.job.id;
                    expect(res.body.job.name).to.eql('TestName3');
                    expect(res.body.job.active).to.eql(1);
                    expect(res.body.job.archived).to.eql(0);
                    expect(res.body.job.tags).to.eql(["tag1", "tag2"]);
                    expect(res.body.job.jobcounter.jobId).to.eql(id_to_delete1);
                    expect(res.body.job.scheduleId == undefined);
                    expect(res.body.job.schedule).not.eql(null);
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('create a new run for update jobcounters', function (done) {
            superagent.post(prefix + '/jobs/'+id_to_delete1+'/runs')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'run': {
                    "jobId": id_to_delete1,
                    'organizationId': organizationIdMaster,
                    'workspaceId': workspaceIdMaster,
                    'startedAt': '2014-08-21T10:00:11Z',
                    "startedByPersonId": updatedByPersonId,
                    "status": 5,
                    "elapsed": '10000',
                    "message": "Hello World!"
                }
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(201);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.run.jobcounter.lastRunId).to.eql(res.body.run.id);
                    id_run_to_delete = res.body.run.id;
                    expect(res.body.run.id).to.be.a('string');
                    expect(res.status).to.eql(201);
                    done();
                });
        });



        it('delete job for jobcounters test', function (done) {
            superagent.del(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete1)
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
