var logger = require("../../lib/logger");
var path = require("path");

var models = Object.create(null);
module.exports = models;

models.transaction = function() {
    return this.sequelize.transaction()
        .disposer(function (transaction, promise)  {
            if (promise.isFulfilled()) {
                return transaction.commit();
            } else {
                return transaction.rollback();
            }
        });
};

module.exports.initialize = function(sequelize) {
    models.sequelize = sequelize;
    var daos = [
        'person',
        'personemail',
        'history',
        'organization',
        'organizationtoperson',
        'job',
        'jobtag',
        'workspace',
        'workspacetoperson',
        'task',
        'run',
        'connection',
        'resetpassword',
        'schedule',
        'jobcounters',
        'payments'
    ];

    daos.forEach(function (dao) {
        var model = sequelize.import(path.join(__dirname, dao));
        models[model.name] = model;
    });

    // Associate models with each other
    Object.keys(models).forEach(function (modelName) {
        if ('associate' in models[modelName]) {
            models[modelName].associate(models);
        }
    });

    return models;
};

