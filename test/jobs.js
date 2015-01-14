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

describe('JOBS API',
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
            superagent.post(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'name': 'TestName1',
                    'active': 1,
                    'archived': 0,
                    'tags': ["edi", "production"],
                    'startsAt': '2014-08-21T10:00:11Z',
                    'rrule': 'FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    id_to_delete = res.body.job.id;
                    expect(res.body.job.name).to.eql('TestName1');
                    expect(res.body.job.active).to.eql(1);
                    expect(res.body.job.archived).to.eql(0);
                    expect(res.body.job.startsAt).to.eql('2014-08-21T10:00:11.000Z');
                    expect(res.body.job.rrule).to.eql('FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0');
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('create a new job without required workspaceId should fail', function (done) {
            superagent.post(prefix + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'workspaceId':9999922149,
                    'name': 'TestName',
                    'tags': ["edi", "production"],
                    'updatedByPersonId':'1',
                    'startsAt': '2014-08-21T10:00:11Z',
                    'rrule': 'FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error==undefined);
                    expect(res.body.job==undefined);
                    expect(res.status).to.eql(400);
                    done();
                });
        });

        it('get all jobs', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
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

        it('get job by id', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.job.id).to.be.a('string');
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(200);
                    done();
                });
        });

        it('update job', function (done) {
            superagent.put(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete)
                .set('Content-Type', 'application/json')
                .send({ 'job':  {
                    'startsAt': '2014-08-21T10:00:11Z',
                    'tags': ["updatededi", "updatedproduction"],
                    'rrule': 'updatedFREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(validator.isDate(res.body.job.startsAt)).to.be.ok();
                    expect(res.status).to.eql(200);
                    done();
                });
        });

        it('delete job', function (done) {
            superagent.del(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete)
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