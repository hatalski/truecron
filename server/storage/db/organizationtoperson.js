module.exports = function(sequelize, DataTypes) {

    var OrganizationToPerson = sequelize.define('OrganizationToPerson', {
        organizationId: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
        personId:       { type: DataTypes.BIGINT, primaryKey: true, allowNull: false },
        role:           { type: DataTypes.ENUM, values: ['admin', 'member'], allowNull: false },
        updatedByPersonId: { type: DataTypes.BIGINT, allowNull: false }
    }, {
        schema: 'tc',
        tableName: 'OrganizationToPerson',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                OrganizationToPerson.belongsTo(models.Organization, { as: 'organization', foreignKey: 'organizationId' });
                OrganizationToPerson.belongsTo(models.Person, { as: 'person', foreignKey: 'personId' });
                OrganizationToPerson.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return OrganizationToPerson;
};