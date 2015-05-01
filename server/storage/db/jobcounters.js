/**
 * Created by Andrew on 29.04.2015.
 */

module.exports = function(sequelize, DataTypes) {

    var JobCounters = sequelize.define('JobCounters', {
        organizationId: { type: DataTypes.BIGINT, allowNull: true },
        workspaceId:    { type: DataTypes.BIGINT, allowNull: true},
        jobId:          { type: DataTypes.BIGINT, primaryKey: true, allowNull: true},
        nextRunAt:      { type: DataTypes.DATE },
        lastRunId:      { type: DataTypes.BIGINT }
        }, {
        schema: 'tc',
        tableName: 'JobCounters',
        timestamps: false,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                JobCounters.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                JobCounters.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                JobCounters.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
            }
        }
    });

    return JobCounters;
};