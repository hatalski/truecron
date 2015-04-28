/**
 * Created by Andrew on 22.10.2014.
 */
module.exports = function(sequelize, DataTypes) {

    var Job = sequelize.define('Job', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        workspaceId: { type: DataTypes.BIGINT, allowNull: false},
        name: { type: DataTypes.STRING(255), allowNull: false },
        active: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
            set: function (value) {
                this.setDataValue('active', value ? 1 : 0);
            },
            get: function () {
                return this.getDataValue('active') != 0;
            } },
        archived: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0,
            set: function (value) {
                this.setDataValue('archived', value ? 1 : 0);
            },
            get: function () {
                return this.getDataValue('archived') != 0;
            } },
        updatedByPersonId: { type: DataTypes.BIGINT },
        scheduleId: { type: DataTypes.BIGINT, allowNull: true}
    }, {
        schema: 'tc',
        tableName: 'Job',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Job.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                Job.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                Job.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
                Job.hasMany(models.JobTag, { as: 'tags', foreignKey: 'jobId'});
                //Job.hasOne(models.Schedules, { as: 'schedule', foreignKey: 'scheduleId' });
            }
        }
    });

    return Job;
};