module.exports = function(sequelize, DataTypes) {

    var Person = sequelize.define('Person', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        name:           { type: DataTypes.STRING(128), allowNull: false },
        passwordHash:   { type: DataTypes.STRING(1024), allowNull: false },
        avatarUrl:      { type: DataTypes.STRING(1024) },
        extensionData:  { type: DataTypes.TEXT },
        lastLoginAt:    { type: DataTypes.DATE },
        updatedByPersonId:{ type: DataTypes.BIGINT }
    }, {
        schema: 'tc',
        tableName: 'person',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Person.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
                Person.hasMany(models.PersonEmail, { as: 'emails', foreignKey: 'personId' });
            }
        }
    });

    return Person;
};