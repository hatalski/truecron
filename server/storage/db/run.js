/**
 * Created by Andrew on 26.11.2014.
 */

module.exports = function(sequelize, DataTypes) {

    var Run = sequelize.define('Run', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        workspaceId: { type: DataTypes.BIGINT, allowNull: false},
        jobId: {type: DataTypes.BIGINT, allowNull: false},
        startedAt: { type: DataTypes.DATE, allowNull: false},
        startedByPersonId: { type: DataTypes.BIGINT },
        status: {type: DataTypes.INTEGER, allowNull: false},
        elapsed: { type: DataTypes.BIGINT, allowNull:false},
        message: {type: DataTypes.TEXT}
        }, {
        schema: 'tc',
        tableName: 'Run',
        timestamps: false,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Run.belongsTo(models.Person, { as: 'startedBy', foreignKey: 'startedByPersonId' });
            }
        }
    });

    return Run;
};
