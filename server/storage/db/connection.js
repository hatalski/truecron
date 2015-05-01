module.exports = function(sequelize, DataTypes) {

    var Connection = sequelize.define('Connection', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        connectionTypeId: { type: DataTypes.STRING(64), allowNull: false },
        name:           { type: DataTypes.STRING(255), allowNull: false },
        settings:       { type: DataTypes.JSON },
        updatedByPersonId:{ type: DataTypes.BIGINT, allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'Connection',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Connection.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
                Connection.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
            }
        }
    });

    return Connection;
};
