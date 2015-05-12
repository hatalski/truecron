"use strict";

var Promise = require("bluebird"),
    Sequelize = require('sequelize'),
    config = require('../lib/config'),
    logger = require("../lib/logger"),
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
        logging: function (message) { logger.debug(message); },
        quoteIdentifiers: true,
        omitNull: true
    };

    this.sequelize = new Sequelize(databaseOptions.database, databaseOptions.user, databaseOptions.password, seqOpts);
    cache.initialize();
    models.initialize(this.sequelize);

    this.Person = require('./person');
    this.Organization = require('./organization');
    this.OrganizationAccess = require('./organization-access');
    this.Jobs = require('./jobs');
    this.Workspace = require('./workspace');
    this.WorkspaceAccess = require('./workspace-access');
    this.Tasks = require('./tasks');
    this.Runs = require('./runs');
    this.History = require('./history');
    this.Connection = require('./connection');
    this.ResetPasswords = require('./resetpasswords');
    this.Schedules = require('./schedules');
    this.Payments = require ('./payments');
    return db.upgradeDatabaseIfNeeded(databaseOptions);
});

Storage.prototype.transaction = function() {
    return models.transaction();
};

module.exports = new Storage();