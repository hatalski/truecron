module.exports = function(sequelize, DataTypes) {

    var Organization = sequelize.define('Organization', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        name:           { type: DataTypes.STRING(128), allowNull: false },
        email:          { type: DataTypes.STRING(256) },
        secretHash:     { type: DataTypes.STRING(1024) },
        plan:           { type: DataTypes.TEXT },
        updatedByPersonId: { type: DataTypes.BIGINT }
    }, {
        schema: 'tc',
        tableName: 'Organization',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Organization.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Organization;
};