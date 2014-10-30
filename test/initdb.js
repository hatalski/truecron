var Promise = require("bluebird"),
    pg = Promise.promisifyAll(require("pg")),
    path = require("path"),
    logger = require("../lib/logger"),
    config = require('../lib/config'),
    dbutils = require("../lib/database");

module.exports = function initDb (done) {
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
