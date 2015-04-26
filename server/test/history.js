var superagent = require('./sagent');
var expect     = require('expect.js');
var _          = require('lodash');
var validator  = require('validator');
var random     = require("randomstring");
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var api        = require('./api');

describe('HISTORY API',
    function() {
        var accessToken = null;

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

        it('should return job history without children', function (done) {
            superagent.get(api.prefix + '/jobs/' + testdata.MyWorkspaceTestJob.id + '/history')
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.meta.total).to.be.a('number');
                    res.body.history.forEach(function (rec) {
                        expect(rec.entity).to.eql('job');
                        expect(rec.jobId).to.eql(testdata.MyWorkspaceTestJob.id);
                        expect(rec.taskId).to.eql(null);
                    });
                    done();
                });
        });

        it('should return job history with children', function (done) {
            superagent.get(api.prefix + '/jobs/' + testdata.MyWorkspaceTestJob.id + '/history')
                .query({ children: 1 })
                .set('Content-Type', 'application/json')
                .send()
                .authenticate(accessToken)
                .endAsync()
                .then(function (res) {
                    expect(res.status).to.eql(200);
                    expect(res.body.meta.total).to.be.a('number');
                    res.body.history.forEach(function (rec) {
                        expect(['task', 'job']).to.contain(rec.entity);
                        expect(rec.jobId).to.eql(testdata.MyWorkspaceTestJob.id);
                    });
                    var taskRecords = _.reduce(res.body.history,
                                               function (sum, rec) { return 'task' === rec.entity ? sum + 1 : sum; }, 0);
                    expect(taskRecords).to.be.above(0);
                    done();
                });
        });

    }
);