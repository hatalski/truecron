/**
 * Created by Andrew on 26.11.2014.
 */

module.exports = function(sequelize, DataTypes) {

    var Run = sequelize.define('Run', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        jobId: {type: DataTypes.BIGINT, allowNull: false},
        startedAt: { type: DataTypes.DATE, allowNull: false},
        startedByPersonId: { type: DataTypes.BIGINT },
        status: {type: DataTypes.INTEGER, allowNull: false},
        elapsed: { type: DataTypes.BIGINT, allowNull:false},
        message: {type: DataTypes.TEXT}
        }, {
        schema: 'tc',
        tableName: 'run',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Run.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
            }
        }
    });

    return Run;
};
