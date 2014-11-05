"use strict";

var Promise = require("bluebird"),
    Sequelize = require('sequelize'),
    config = require('../../lib/config'),
    logger = require("../../lib/logger"),
    db = require('./db'),
    cache = require('./cache'),
    models = require('./db/models');

function Storage() {
}

Storage.prototype.initialize = Promise.method(function initialize() {
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
        logging: logger.debug,
        quoteIdentifiers: false,
        omitNull: true
    };

    this.sequelize = new Sequelize(databaseOptions.database, databaseOptions.user, databaseOptions.password, seqOpts);
    cache.initialize();
    models.initialize(this.sequelize);

    this.Person = require('./person');
    this.Jobs = require('./jobs');
    this.Tasks = require('./tasks');
    //this.Organization = require('./organization');
    //this.Workspace = require('./workspace');

    return db.upgradeDatabaseIfNeeded(databaseOptions);
});

Storage.prototype.transaction = function() {
    return models.transaction();
};

// TEMP
Storage.prototype.tempfindOrganizationById = Promise.method(function (id) {
    return models.Organization.find({ where: { id: id } });
});

module.exports = new Storage();