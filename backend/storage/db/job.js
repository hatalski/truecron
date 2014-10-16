module.exports = function(sequelize, DataTypes) {

    var Job = sequelize.define('Job', {
        id:                { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        workspaceId:       { type: DataTypes.BIGINT},
        name:              { type: DataTypes.STRING(255), allowNull: false },
        active:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
        archived:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
        updatedByPersonId: { type: DataTypes.BIGINT },
        startsAt:          { type: DataTypes.DATE },
        rrule:             { type: DataTypes.TEXT, allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'job',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Job.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                Job.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Job;
};