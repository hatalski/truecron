var Promise = require('bluebird'),
    pg = Promise.promisifyAll(require('pg')),
    path = require('path'),
    logger = require('../lib/logger'),
    config = require('../lib/config'),
    dbutils = require('../lib/database'),
    context = require('../backend/context');

var system = module.exports.system = { id: context.SystemPersonId, name: 'SYSTEM', email: 'system@truecron.com' };

var brian = module.exports.BrianJohnston = { id: -10, name: 'Brian Johnston', email: 'bj@it.acme.corp' };
var acme = module.exports.AcmeCorp = { id: -11, name: 'Acme Corporation', email: 'bj@it.acme.corp', updatedByUserId: brian.id };
var myWorkspace = module.exports.MyWorkspace = { id: -12, name: 'My workspace', organizationId: acme.id, updatedByUserId: brian.id };
var testJob = module.exports.MyWorkspaceTestJob = { id: -13, name: 'My workspace test job', updatedByUserId: brian.id };
var testTaskType = module.exports.TestTaskType = { id: -100, name: 'TestType' };
var testTask = module.exports.MyWorkspaceTestTask = { id: -14, name: 'My workspace test job task', jobId: testJob.id, taskTypeId: testTaskType.id, updatedByUserId: brian.id };

var suresh = module.exports.SureshKumar = { id: -20, name: 'Suresh Kumar', email: 'skumar@ajax.corp' };
var petrov = module.exports.IvanPetrov = { id: -24, name: 'Иван Петров', email: 'petrov@ajax.corp' };
var ajax = module.exports.AjaxCorp = { id: -21, name: 'Ajax Corporation', email: 'dev-cron@ajax.corp', updatedByUserId: suresh.id };
module.exports.StagingWorkspace = { id: -22, name: 'Staging', organizationId: ajax.id, updatedByUserId: suresh.id };
module.exports.ProductionWorkspace = { id: -23, name: 'Production', organizationId: ajax.id, updatedByUserId: suresh.id };


module.exports.initdb = function initDb (done) {
    var databaseOptions = {
        host: config.get('POSTGRE_HOST'),
        port: config.get('POSTGRE_PORT'),
        database: config.get('POSTGRE_DATABASE'),
        user: config.get('POSTGRE_USERNAME'),
        password: config.get('POSTGRE_PASSWORD')
    };

    return Promise.using(dbutils.getConnection(databaseOptions), function (connection) {
        var scriptPath = path.join(__dirname, 'testdata.sql');
        return dbutils.runScript(connection, scriptPath)
            .then(function () {
                done();
            });
    })
    .catch(function (err) {
        logger.error('Failed to fill database with test data .' + err.toString());
        done(err);
    });
};

