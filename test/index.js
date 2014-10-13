var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';
var log        = require('../lib/logger.js');
log.info('API tests prefix: ' + prefix);
var pg = require('pg.js');

var conString = "postgres://" +
    config.get('POSTGRE_USERNAME') +
    ":" + config.get('POSTGRE_PASSWORD') + "@" +
    config.get('POSTGRE_HOST') +
    ":" + config.get('POSTGRE_PORT')
    + "/" + config.get('POSTGRE_DATABASE');
log.info('PG connection string: ' + conString);

describe('TEST API',
    function() {
        it('test', function(done) {
            superagent.get(prefix + '/echo')
                .send()
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.body.message).to.eql('OK');
                    done();
                });
        });
    }
);

describe('DB CONNECTION TEST',
    function() {
        it('can connect', function(done) {
            pg.connect(conString, function(err, client, d) {
                expect(err).to.eql(null);
                expect(client).to.be.an('object');
                done();
            });
        });
    }
);

describe('JOBS API',
    function() {
        var id;
        it('get all jobs', function(done) {
            superagent.get(prefix + '/organizations/1/workspaces/1/jobs')
                .send()
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(200);
                    done();
                });
        });

        it('create a job', function (done) {
            superagent.post(prefix + '/organizations/1/workspaces/1/jobs')
                .send({
                    "name": "My first job",
                    "tags": ["edi", "production"],
                    "startsAt": "2014-08-21T10:00:11Z",
                    "rrule": "FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0"
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(201);
                    expect(res.body.job.id).to.be.a('number');
                    done();
                });
        });

        it('create a job with name only', function (done) {
            superagent.post(prefix + '/organizations/1/workspaces/1/jobs')
                .send({
                    "name": "My first job"
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res.body);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.status).to.eql(201);
                    expect(res.body.job.id).to.be.a('number');
                    done();
                });
        });
    });