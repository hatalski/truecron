var Promise = require("bluebird"),
    pg = Promise.promisifyAll(require("pg")),
    fs = Promise.promisifyAll(require("fs")),
    path = require("path"),
    logger = require("../../lib/logger"),
    dbutils = require("../../lib/database");

//
// Database connections and upgrades
//

function getSchemaVersionFromFile(filePath) {
    return fs.readFileAsync(filePath, "utf8")
        .then(function parseContent(fileContent) {
            var versionRegex = /^\s*perform\s+CommitSchemaVersion\s*\(\s*(\d+),/img,
                version;
            for (var m = versionRegex.exec(fileContent); m !== null; m = versionRegex.exec(fileContent)) {
                version = parseInt(m[1]);
            }
            if (version === undefined) {
                throw new Error('Could not get schema version from the file.');
            }
            return version;
        });
}

function getDatabaseSchemaVersion(connection) {
    return connection.queryAsync("select count(*) as present from information_schema.tables where table_schema='public' and table_name='schemaversion'")
        .then(function checkSchemaPresence(result) {
            if (parseInt(result.rows[0].present) === 0) {
                logger.info('The database is new, it has no version table.');
                return 0;
            }
            return connection.queryAsync("select max(version) as version from SchemaVersion")
                .then(function retrieveDbVersion(result) {
                    if (result.rows.length !== 1) {
                        throw new Error('Could not get database schema version. Query returned no results.');
                    }
                    return parseInt(result.rows[0].version);
                });
        })
        .error(function handleSchemaError(e) {
            logger.error('Could not get database schema version. ' + e.message);
            throw e;
        });
}

module.exports.upgradeDatabaseIfNeeded = Promise.method(function upgradeDatabaseIfNeeded(databaseOptions) {
    logger.debug('Checking if the database needs to be upgraded.');
    return Promise.using(dbutils.getConnection(databaseOptions), function (connection) {
        var scriptPath = path.join(__dirname, 'schema.sql');
        return Promise.join(
            getSchemaVersionFromFile(scriptPath),
            getDatabaseSchemaVersion(connection),
            function (fileVersion, databaseVersion) {
                logger.info('Schema file version: %d, Database version: %d', fileVersion, databaseVersion);
                if (fileVersion === databaseVersion) {
                    return;
                }
                logger.info('Upgrading database');
                return dbutils.runScript(connection, scriptPath)
                    .then(function () {
                        logger.info('Database has been upgraded successfully.');
                    });
            });
    });
});

