import DS from 'ember-data';

var Org =       DS.Model.extend({
    name:       DS.attr('string'),
    email:      DS.attr('string'),
    plan:       DS.attr('string'),
    createdAt:  DS.attr('date', { defaultValue: new Date() }),
    updatedAt:  DS.attr('date', { defaultValue: new Date() }),
    updatedBy:  DS.belongsTo('person', { async: true }),
    workspaces: DS.hasMany('workspace', { async: true }),
    users:      DS.hasMany('person', { async: true, inverse: 'updatedBy' })
});

export default Org;
