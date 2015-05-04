/**
* Created by Andrew on 26.11.2014.
*/
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

log.info('API tests prefix: ' + prefix);

var taskTypeId=-100;
var updatedByPersonId=-1;
var id_to_delete;
var organizationIdMaster=testdata.AcmeCorp.id;
var workspaceIdMaster=testdata.MyWorkspace.id;
var id_task_to_delete;
var id_run_to_delete;
var testDataIdJob=-222;

describe('RUNS API',
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
                    'organizationId': organizationIdMaster,
                    'workspaceId': workspaceIdMaster,
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

        // TODO: This shouldn't be in API
        it('create a new run', function (done) {
            superagent.post(prefix + '/jobs/'+id_to_delete+'/runs')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'run': {
                    "jobId": id_to_delete,
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
                    id_run_to_delete = res.body.run.id;
                    expect(res.body.run.id).to.be.a('string');
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('get all runs', function (done) {
            superagent.get(prefix + '/jobs/'+id_to_delete+'/runs')
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

        it('get run by id', function (done) {
            superagent.get(prefix + '/jobs/' + id_to_delete + '/runs/'+id_run_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.run.id).to.be.a('string');
                    expect(validator.isDate(res.body.run.startedAt)).to.be.ok();
                    done();
                });
        });

        it('get non-existent run by id  should fail with 404', function (done) {
            superagent.get(prefix + '/jobs/' + id_to_delete+'/runs/-34654651')
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(404);
                    expect(res.body.error.status).to.eql(404);
                    done();
                });
        });

        //it('update run', function (done) {
        //    superagent.put(prefix + '/jobs/' + id_to_delete+'/runs/'+id_run_to_delete)
        //        .set('Content-Type', 'application/json')
        //        .send({ "run":  {
        //            "message": 'Hello my world!!!'
        //        }
        //        })
        //        .authenticate(accessToken)
        //        .end(function (e, res) {
        //            expect(e).to.eql(null);
        //            expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
        //            expect(res.status).to.eql(200);
        //            done();
        //        });
        //});
        //id_to_delete=-222;
        //id_run_to_delete=3;
        //it('delete run', function (done) {
        //    superagent.del(prefix + '/jobs/' + id_to_delete+'/runs/'+id_run_to_delete)
        //        .send()
        //        .authenticate(accessToken)
        //        .end(function (e, res) {
        //            expect(e).to.eql(null);
        //            expect(res.body.error).to.eql(undefined);
        //            expect(res.status).to.eql(204);
        //            done();
        //        });
        //});

        //it('delete non-existent run should fail with 404', function (done) {
        //    superagent.del(prefix + '/jobs/' + testDataIdJob+'/runs/-123154654')
        //        .send()
        //        .authenticate(accessToken)
        //        .end(function (e, res) {
        //            expect(e).to.eql(null);
        //            expect(res.status).to.eql(404);
        //            expect(res.body.error.status).to.eql(404);
        //            done();
        //        });
        //});

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