module.exports = function(sequelize, DataTypes) {

    var History = sequelize.define('History', {
        id:       { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        personId: { type: DataTypes.BIGINT, allowNull: false },
        resourceUrl: { type: DataTypes.STRING(256), allowNull: false },
        operation: { type: DataTypes.STRING(128), allowNull: false },
        change:   { type: DataTypes.STRING(8192), allowNull: false },
        oldValue: { type: DataTypes.STRING(8192) }
    }, {
        schema: 'tc',
        tableName: 'history',
        timestamps: true,
        updatedAt: false,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                History.belongsTo(models.Person, { as: 'person', foreignKey: 'personId' });
            }
        }
    });

    return History;
};