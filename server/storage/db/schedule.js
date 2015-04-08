/**
 * Created by estet on 3/11/15.
 */
module.exports = function(sequelize, DataTypes) {

    var Schedule = sequelize.define('Schedule', {
        id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        dtStart: { type: DataTypes.DATE, allowNull: false },
        dtEnd: { type: DataTypes.DATE, allowNull: true},
        rrule: { type: DataTypes.TEXT, allowNull: false },
        exrule: { type: DataTypes.TEXT, allowNull: true },
        rdate: { type: DataTypes.TEXT, allowNull: true },
        exdate: { type: DataTypes.TEXT, allowNull: true }
    }, {
        schema: 'tc',
        tableName: 'Schedule',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
        }
    });

    return Schedule;
};