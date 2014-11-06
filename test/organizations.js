var superagent = require('superagent');
var expect     = require('expect.js');
var validator  = require('validator');
var random     = require("randomstring");
var util       = require('util');
var url        = require('url');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var context    = require('../backend/context.js');
var auth       = require('./auth');
var testdata   = require('./testdata');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

log.info('API tests prefix: ' + prefix);

describe('ORGANIZATIONS API',
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

        it('create a new organization without authentication should fail', function (done) {
            superagent.post(prefix + '/organizations')
                .set('Content-Type', 'application/json')
                .send({ 'organization': { 'name': orgName }})
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(401);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(401);
                    done();
                });
        });
        it('create a new organization without name should fail', function (done) {
            superagent.post(prefix + '/organizations')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'organization': { } })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(400);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    done();
                });
        });
        var id_to_delete;
        it('create a new organization', function (done) {
            superagent.post(prefix + '/organizations')
                .set('Content-Type', 'application/json')
                .authenticate(accessToken)
                .send({ 'organization': { name: orgName } })
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(201);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    id_to_delete = res.body.organization.id;
                    expect(res.body.organization.id).to.be.a('string');
                    expect(res.body.organization.name).to.eql(orgName);
                    expect(res.body.organization.updatedByPersonId).to.eql(testdata.BrianJohnston.id);
                    expect(validator.isDate(res.body.organization.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.organization.updatedAt)).to.be.ok();
                    done();
                });
        });
        it.only('sequalize findAndCountAll test', function (done) {
            var Promise = require("bluebird"),
                Sequelize = require('sequelize'),
                models = require('../backend/storage/db/models');

            var databaseOptions = {
                host: config.get('POSTGRE_HOST'),
                port: config.get('POSTGRE_PORT'),
                database: config.get('POSTGRE_DATABASE'),
                user: config.get('POSTGRE_USERNAME'),
                password: config.get('POSTGRE_PASSWORD')
            };
            var seqOpts = {
                host: databaseOptions.host,
                port: databaseOptions.port,
                dialect: 'postgres',
                logging: log.debug,
                quoteIdentifiers: false,
                omitNull: true
            };

            this.sequelize = new Sequelize(databaseOptions.database, databaseOptions.user, databaseOptions.password, seqOpts);
            models.initialize(this.sequelize);
            var options = {
                where: { name: { like: '%Acme%' } },
                order: 'name asc',
                limit: 30,
                offset: 0
            };
            models.Organization.findAndCountAll(options)
                .then(function (result) {
                    log.debug('findAndCountAll result: ' + util.inspect(result, { depth: 3 }));
                    expect(result.rows).to.have.length(1);
                    expect(result.count).to.eql(1);
                    done();
                });

        });
        it('search for organization', function (done) {
            superagent.get(prefix + '/organizations')
                .query({ q: orgName })
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    log.debug('search result: ' + util.inspect(res.body, { depth: 3 }));
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.organizations).to.have.length(1);
                    expect(res.body.meta.total).to.eql(1);
                    expect(res.body.organizations[0].organization.name).to.eql(orgName);
                    done();
                });
        });
        it('get organization by id', function (done) {
            superagent.get(prefix + '/organizations/' + id_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.organization.id).to.be.a('string');
                    expect(res.body.organization.name).to.eql(orgName);
                    expect(validator.isDate(res.body.organization.createdAt)).to.be.ok();
                    expect(validator.isDate(res.body.organization.updatedAt)).to.be.ok();
                    done();
                });
        });
        it('update organization', function (done) {
            superagent.put(prefix + '/organizations/' + id_to_delete)
                .set('Content-Type', 'application/json')
                .send({ 'organization': {'name': orgName + ', Inc.', 'email': 'admins@gmail.com' } })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(200);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.eql(undefined);
                    expect(res.body.organization.name).to.eql(orgName + ', Inc.');
                    expect(res.body.organization.email).to.eql('admins@gmail.com');
                    done();
                });
        });
        it('update organization with empty name should fail', function (done) {
            superagent.put(prefix + '/organizations/' + id_to_delete)
                .set('Content-Type', 'application/json')
                .send({ name: '' })
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.header['content-type']).to.eql('application/json; charset=utf-8');
                    expect(res.body.error).to.be.an('object');
                    expect(res.body.error.status).to.eql(400);
                    expect(res.status).to.eql(400);
                    done();
                });
        });
        it('delete organization', function (done) {
            superagent.del(prefix + '/organizations/' + id_to_delete)
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(204);
                    expect(res.body.error).to.eql(undefined);
                    done();
                });
        });
        it('delete non-existent organization should fail with 404', function (done) {
            superagent.del(prefix + '/organizations/-384579237')
                .send()
                .authenticate(accessToken)
                .end(function (e, res) {
                    expect(e).to.eql(null);
                    expect(res.status).to.eql(404);
                    expect(res.body.error.status).to.eql(404);
                    done();
                });
        });
    }
);