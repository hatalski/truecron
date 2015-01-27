var Promise = require("bluebird"),
    pg = Promise.promisifyAll(require("pg")),
    fs = Promise.promisifyAll(require("fs")),
    logger = require("./logger");

var getConnection = module.exports.getConnection = function (databaseOptions) {
    "use strict";
    var close;
    return pg.connectAsync(databaseOptions).spread(function (client, done) {
        close = done;
        return client;
    }).disposer(function () {
        try {
            if (close) {
                close();
            }
        } catch (e) {
            // It should be pretty safe to swallow exceptions here
            logger.error('Failed to close PG connection. ' + e.message);
        }
    });
};

var runScript = module.exports.runScript = function (connection, scriptFilePath) {
    return fs.readFileAsync(scriptFilePath, "utf8")
        .then(function (fileContent) {
            return connection.queryAsync(fileContent);
        })
        .error(function (e) {
            logger.error('Failed to execute script %s. %s', scriptFilePath, e.toString());
            throw e;
        });
};


