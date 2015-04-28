module.exports = function(sequelize, DataTypes) {

    var History = sequelize.define('History', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        updatedByPersonId: { type: DataTypes.BIGINT, allowNull: false },
        organizationId: { type: DataTypes.BIGINT, allowNull: true },
        workspaceId:    { type: DataTypes.BIGINT, allowNull: true },
        jobId:          { type: DataTypes.BIGINT, allowNull: true },
        taskId:         { type: DataTypes.BIGINT, allowNull: true },
        connectionId:   { type: DataTypes.BIGINT, allowNull: true },
        personId:       { type: DataTypes.BIGINT, allowNull: true },
        operation:      { type: DataTypes.STRING(128), allowNull: false },
        entity:         { type: DataTypes.ENUM, values: ['person', 'organization', 'workspace', 'job', 'task', 'connection'], allowNull: false },
        change:         { type: DataTypes.STRING(8192), allowNull: false },
        oldValue:       { type: DataTypes.STRING(8192) }
    }, {
        schema: 'tc',
        tableName: 'History',
        timestamps: true,
        updatedAt: false,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                History.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
                History.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                History.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                //History.belongsTo(models.Jobs, { as: 'job', foreignKey: { name : 'jobId', allowNull: false} });
                //History.belongsTo(models.Tasks, { as: 'task', foreignKey: { name : 'taskId', allowNull: false} });
                History.belongsTo(models.Connection, { as: 'connection', foreignKey: 'connectionId' });
                History.belongsTo(models.Person, { as: 'person', foreignKey: 'personId' });
            }
        }
    });

    return History;
};