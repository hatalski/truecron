///**
// * Created by Andrew on 05.05.2015.
// */
//
//var superagent = require('superagent');
//var expect     = require('expect.js');
//var validator  = require('validator');
//var config     = require('../lib/config.js');
//var log        = require('../lib/logger.js');
//var auth       = require('./auth');
//var testdata   = require('./testdata');
//var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';
//
//describe('PAYMENTs API',
//    function() {
//        var accessToken = null;
//        before(function (done) {
//            testdata.initdb(function (err) {
//                if (err) done(err);
//                auth.getAccessToken(function (err, token) {
//                    if (err) return done(err);
//                    accessToken = token;
//                    done();
//                });
//            });
//        });
//        var id_to_delete;
//
//        it('create a new payment', function (done) {
//            console.log("!!!!testdata.AcmeCorp.id: "+ testdata.AcmeCorp.id);
//            console.log("!!!!testdata.MyWorkspace.id: "+ testdata.MyWorkspace.id);
//            superagent.post(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/payments')
//                .set('Content-Type', 'application/json')
//                .send({ 'payment': {
//                    'organizationId': testdata.AcmeCorp.id,
//                    'amount': 100000,
//                    'description': 'for good job',
//                    'paymentMethod': 'VISA',
//                    'receipt': 'test receipt'
//                }
//                })
//                .authenticate(accessToken)
//                .end(function (e, res) {
//                    //console.log('!!!!!res.body.payment.id: '+res.body.payment.id);
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    //id_to_delete = res.body.payment.id;
//                    //expect(res.body.payment.amount).to.eql(100000);
//                    //expect(res.body.payment.description).to.eql('for good job');
//                    //expect(res.body.payment.paymentMethod).to.eql('VISA');
//                    //expect(res.body.payment.receipt).to.eql('test receipt');
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });
//
//        it.only('create a new payment2', function (done) {
//            console.log("!!!!testdata.AcmeCorp.id: "+ testdata.AcmeCorp.id);
//            console.log("!!!!testdata.MyWorkspace.id: "+ testdata.MyWorkspace.id);
//            superagent.post('https://dev.truecron.com' + '/payments')
//                .set('Content-Type', 'application/json')
//                .send({ 'payment': {
//                    'organizationId': testdata.AcmeCorp.id,
//                    'amount': 100000,
//                    'description': 'for good job',
//                    'paymentMethod': 'VISA',
//                    'receipt': 'test receipt'
//                }
//                })
//                .authenticate(accessToken)
//                .end(function (e, res) {
//                    //console.log('!!!!!res.body.payment.id: '+res.body.payment.id);
//                    expect(e).to.eql(null);
//                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
//                    //id_to_delete = res.body.payment.id;
//                    //expect(res.body.payment.amount).to.eql(100000);
//                    //expect(res.body.payment.description).to.eql('for good job');
//                    //expect(res.body.payment.paymentMethod).to.eql('VISA');
//                    //expect(res.body.payment.receipt).to.eql('test receipt');
//                    expect(res.status).to.eql(201);
//                    done();
//                });
//        });
//
//
//        it('get all payments', function (done) {
//            superagent.get(prefix + '/organizations/' + testdata.AcmeCorp.id + '/workspaces/' + testdata.MyWorkspace.id + '/payments')
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
//    }
//);
