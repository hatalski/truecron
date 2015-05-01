module.exports = function(sequelize, DataTypes) {

    var Task = sequelize.define('Task', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        workspaceId:    { type: DataTypes.BIGINT, allowNull: false},
        jobId:          { type: DataTypes.BIGINT, allowNull: false},
        name:           { type: DataTypes.STRING(255), allowNull: false },
        active:         { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1,
                            set: function (value) {
                                this.setDataValue('active', value ? 1 : 0);
                            },
                            get: function () {
                                return this.getDataValue('active') != 0;
                            }
                        },
        position:       { type: DataTypes.INTEGER, allowNull:false },
        taskTypeId:     { type: DataTypes.BIGINT, allowNull:false },
        settings:       { type: DataTypes.JSON },
        updatedByPersonId:{ type: DataTypes.BIGINT, allowNull:false},
        timeout:        { type: DataTypes.BIGINT, allowNull:false}
    }, {
        schema: 'tc',
        tableName: 'Task',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Task.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                Task.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                Task.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Task;
};