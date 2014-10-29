/**
 * Created by Andrew on 28.10.2014.
 */
module.exports = function(sequelize, DataTypes) {

    var Task = sequelize.define('Task', {
        id:             { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
        jobId:          { type: DataTypes.BIGINT, allowNull: false },
        name:           { type: DataTypes.STRING(255), allowNull: false },
        active: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1,
            set: function (value) {
                this.setDataValue('active', value ? value : 1);
            },
            get: function () {
                return this.getDataValue('active') != 1;
            } },
        position:       { type: DataTypes.INTEGER, allowNull: false },
        taskTypeId:     { type: DataTypes.BIGINT },
        settings:       { type: DataTypes.TEXT, allowNull: false,
                            get: function () {
                                var value = this.getDataValue('settings');
                                if (!!value && typeof value === 'string') {
                                    return JSON.parse(value);
                                }
                                return value;
                            },
                            set: function (value) {
                                if (typeof value === 'object') {
                                    value = JSON.stringify(value);
                                }
                                this.setDataValue('settings', value);
                            }
                        },
        timeout:        {type: DataTypes.interval, allowNull: false},
        lastLoginAt:    { type: DataTypes.DATE },
        updatedByPersonId:{ type: DataTypes.BIGINT, allowNull: false}
    }, {
        schema: 'tc',
        tableName: 'Task',
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            associate: function(models) {
                Task.belongsTo(models.Person, { as: 'updatedBy', foreignKey: 'updatedByPersonId' });
            }
        }
    });

    return Task;
};