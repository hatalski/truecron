/**
* Created by Andrew on 29.10.2014.
*/
var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var auth       = require('./auth');
var initdb     = require('./initdb');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

var jobsId=-33;

log.info('API tests prefix: ' + prefix);

describe('TASKS API',
    function() {
        var accessToken = null;
        before(function (done) {
            initdb(function (err) {
                if (err) done(err);
                auth.getAccessToken(function (err, token) {
                    if (err) return done(err);
                    accessToken = token;
                    done();
                });
            });
        });
        var workspaceIdMaster=-12;
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


    });

