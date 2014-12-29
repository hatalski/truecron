/**
 * Created by ghost on 29.12.2014.
 */

module.exports = function(sequelize, DataTypes) {

    var JobTag = sequelize.define('JobTag', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        jobId: { type: DataTypes.BIGINT}
    }, {
        schema: 'tc',
        tableName: 'jobtag',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function (models) {
                JobTag.belongsTo(models.Job, { as: 'job', foreignKey: 'jobId' });
            }
        }
    });

    return JobTag;
};
