module.exports = function(sequelize, DataTypes) {

    var Workspace = sequelize.define('Workspace', {
        id:                { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        name:              { type: DataTypes.STRING(255), allowNull: false },
        updatedByPersonId: { type: DataTypes.BIGINT }
    }, {
        schema: 'tc',
        tableName: 'workspace',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Workspace.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                Workspace.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Workspace;
};