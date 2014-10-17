var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

describe('USERS API',
    function() {
        it('create a new user', function (done) {
            superagent.post(prefix + '/users')
                .set('Content-Type', 'application/json')
                .send({ 'user': {'name': "Alice", 'password': "P@ssw0rd"} })
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(201);
                    done();
                });
        });
        it('get list of users', function (done) {
            superagent.get(prefix + '/users')
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('get user by id', function (done) {
            superagent.get(prefix + '/users/1')
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
    }
);

describe('JOBS API',
    function() {
        it('get all jobs', function(done) {
            superagent.get(prefix + '/workspaces/-2/1')
                .send()
                .auth('-2', 'Igd7en1_VCMP59pBpmEF')
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    done();
                });
        });

//        it('create a job', function (done) {
//            superagent.post(prefix + '/organizations/1/workspaces/1/jobs')
//                .send({
//                    "name": "My first job",
//                    "tags": ["edi", "production"],
//                    "startsAt": "2014-08-21T10:00:11Z",
//                    "rrule": "FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0"
//                })
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.status).to.eql(201);
//                    expect(res.body.job.id).to.be.a('number');
//                    done();
//                });
//        });
//
//        it('create a job with name only', function (done) {
//            superagent.post(prefix + '/organizations/1/workspaces/1/jobs')
//                .send({
//                    "name": "My first job"
//                })
//                .end(function (e, res) {
//                    expect(e).to.eql(null);
//                    console.dir(res.body);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    expect(res.status).to.eql(201);
//                    expect(res.body.job.id).to.be.a('number');
//                    done();
//                });
//        });
    });
