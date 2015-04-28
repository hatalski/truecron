module.exports = function(sequelize, DataTypes) {

    var Workspace = sequelize.define('Workspace', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        name:           { type: DataTypes.STRING(256), allowNull: false },
        updatedByPersonId: { type: DataTypes.BIGINT }
    }, {
        schema: 'tc',
        tableName: 'Workspace',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Workspace.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Workspace;
};