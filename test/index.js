var superagent = require('superagent');
var expect = require('expect.js');

describe('JOBS API',
    function() {
        var id;
        it('get all jobs', function(done) {
            superagent.get('http://dev.truecron.com:3000/api/v1/workspaces/1/1/jobs')
                .send()
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
        it('create a job', function (done) {
            superagent.post('http://dev.truecron.com:3000/api/v1/workspaces/1/1/jobs')
                .send({
                    "name": "My first job",
                    "tags": ["edi", "production"],
                    "start_time": "2014-08-21T10:00:11Z",
                    "rrule": "FREQ=DAILY;INTERVAL=1;BYDAY=MO;BYHOUR=12;BYMINUTE=0;BYSECOND=0"
                })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    console.dir(res);
                    expect(res.status).to.eql(201);
                    done();
                });
        });
    });