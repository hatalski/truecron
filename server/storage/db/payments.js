/**
 * Created by Andrew on 05.05.2015.
 */

module.exports = function(sequelize, DataTypes) {

    var Payments = sequelize.define('Payments', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        organizationId: { type: DataTypes.BIGINT, allowNull: false },
        date:           { type: DataTypes.DATE },
        amount:         { type: DataTypes.BIGINT, allowNull: false },
        description:    { type: DataTypes.TEXT },
        paymentMethod:  { type: DataTypes.TEXT, allowNull: false },
        receipt:        { type: DataTypes.STRING(255), allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'Payments',
        timestamps: false,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                Payments.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
            }
        }
    });

    return Payments;
};
