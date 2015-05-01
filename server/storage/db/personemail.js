module.exports = function(sequelize, DataTypes) {

    var PersonEmail = sequelize.define('PersonEmail', {
        id:       { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        personId: { type: DataTypes.BIGINT, allowNull: false },
        email:    {
                    type: DataTypes.STRING(256), allowNull: false,
                    set: function (value) {
                        this.setDataValue('email', value.toString().toLowerCase());
                    }
        },
        status:   { type: DataTypes.ENUM, values: ['pending', 'active'], allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'PersonEmail',
        timestamps: false,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                PersonEmail.belongsTo(models.Person, { as: 'person', foreignKey: 'personId' });
            }
        }
    });

    return PersonEmail;
};