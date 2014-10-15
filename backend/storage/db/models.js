var logger = require("../../../lib/logger");
var path = require("path");

var models = Object.create(null);
module.exports = models;

models.transaction = function() {
    return this.sequelize.transaction();
};

module.exports.initialize = function(sequelize) {
    models.sequelize = sequelize;
    var daos = [
        'person',
        'personemail',
        'history',
        'organization'
        //'workspace',
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
