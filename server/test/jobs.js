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
        var id_to_delete2;
        var id_to_delete3;
        it('create a new job', function (done) {
            superagent.post(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'name': 'TestName1',
                    'active': 1,
                    'archived': 0,
                    'tags': ["edi", "production"],
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
                    id_to_delete = res.body.job.id;
                    expect(res.body.job.name).to.eql('TestName1');
                    expect(res.body.job.active).to.eql(1);
                    expect(res.body.job.archived).to.eql(0);
                    expect(res.body.job.scheduleId == undefined);
                    expect(res.body.job.schedule).not.eql(null);
                    expect(res.body.job.schedule != 'undefined');
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(201);
                    done();
                });
        });


        it('create a new job without organizations id', function (done) {
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
                    id_to_delete3 = res.body.job.id;
                    expect(res.body.job.name).to.eql('TestName3');
                    expect(res.body.job.active).to.eql(1);
                    expect(res.body.job.archived).to.eql(0);
                    expect(res.body.job.tags).to.eql(["tag1", "tag2"]);
                    expect(res.body.job.scheduleId == undefined);
                    expect(res.body.job.schedule).not.eql(null);
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(201);
                    done();
                });
        });

        it('create a new job without tags', function (done) {
            superagent.post(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .send({ 'job': {
                    'name': 'TestName1',
                    'active': 1,
                    'archived': 0,
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
                    id_to_delete2 = res.body.job.id;
                    expect(res.body.job.name).to.eql('TestName1');
                    expect(res.body.job.active).to.eql(1);
                    expect(res.body.job.archived).to.eql(0);
                    expect(res.body.job.tags).to.eql(undefined);
                    expect(res.body.job.scheduleId).to.eql(undefined);
                    expect(res.body.job.schedule).not.eql(null);
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

        it('get jobs by non-existent tag', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .query({ tag: 'NON-EXISTENT-TAG-NON-EXISTENT-TAG-NON-EXISTENT-TAG' })
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    expect(res.body.meta.total).to.eql(0);
                    done();
                });
        });

        it('get jobs by tag', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs')
                .set('Content-Type', 'application/json')
                .query({ tag: 'tag2' })
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    expect(res.body.meta.total).to.be.above(0);
                    res.body.jobs.forEach(function (job) {
                        expect(job.tags).to.contain('tag2');
                    });
                    done();
                });
        });

        it('get job by organization, workspace and id', function (done) {
            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.job.id).to.be.a('string');
                    expect(res.body.job.schedule != undefined);
                    expect(validator.isDate(res.body.job.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.job.updatedAt)).to.be.ok();
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('get job by id only', function (done) {
            superagent.get(prefix + '/jobs/' + id_to_delete)
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
        it('get job by id with tags', function (done) {
            superagent.get(prefix + '/jobs/' + testdata.MyWorkspaceTestJob.id)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.job.id).to.eql(testdata.MyWorkspaceTestJob.id);
                    expect(res.body.job.tags).to.eql(['tag1', 'tag2']);
                    done();
                });
        });
        it('update job with tags', function (done) {
            superagent.put(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/jobs/' + id_to_delete)
                .set('Content-Type', 'application/json')
                .send({
                    'job': {
                        'schedule': {
                            'dtStart': '2014-08-21T10:00:11Z',
                            'rrule': 'updatedFREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0'
                        },
                        'tags': ['updated', 'edi']
                    }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    log.info(res.body.job);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    //expect(res.body.job.scheduleId).not.eql(null);
                    //expect(validator.isDate(res.body.job.startsAt)).to.be.ok();
                    expect(res.status).to.eql(200);
                    expect(res.body.job.tags).to.eql(['updated', 'edi']);
                    done();
                });
        });

        it('update job without tags', function (done) {
            superagent.put(prefix + '/jobs/' + id_to_delete)
                .set('Content-Type', 'application/json')
                .send({
                    'job': {
                        'schedule': {
                            'dtStart': '2014-08-21T10:00:11Z',
                            'rrule': 'updatedFREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0',
                            'id' : -10
                        },
                        'scheduleId' : -10
                    }
                })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.job.scheduleId).not.eql(null);
                    //expect(validator.isDate(res.body.job.startsAt)).to.be.ok();
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

        it('delete job2', function (done) {
            superagent.del(prefix + '/jobs/' + id_to_delete2)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(204);
                    done();
                });
        });

        it('delete job3', function (done) {
            superagent.del(prefix + '/jobs/' + id_to_delete3)
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
