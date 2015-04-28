module.exports = function(sequelize, DataTypes) {

    var WorkspaceToPerson = sequelize.define('WorkspaceToPerson', {
        workspaceId:    { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
        personId:       { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
        role:           { type: DataTypes.ENUM, values: ['viewer', 'editor'], allowNull: false },
        updatedByPersonId: { type: DataTypes.BIGINT, allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'WorkspaceToPerson',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                WorkspaceToPerson.belongsTo(models.Workspace, { as: 'workspace', foreignKey: 'workspaceId' });
                WorkspaceToPerson.belongsTo(models.Person, { as: 'person', foreignKey: 'personId' });
                WorkspaceToPerson.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return WorkspaceToPerson;
};