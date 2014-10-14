module.exports = function(sequelize, DataTypes) {

    var Job = sequelize.define('Job', {
        id:                { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        name:              { type: DataTypes.STRING(255), allowNull: false },
        active:            { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        archived:          { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        rrule:             { type: DataTypes.TEXT, allowNull: false },
        startsAt:          { type: DataTypes.DATE },
        updatedByPersonId: { type: DataTypes.BIGINT }
    }, {
        schema: 'tc',
        tableName: 'job',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Job.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
            }
        }
    });

    return Job;
};