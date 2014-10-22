import DS from 'ember-data';

export default DS.Model.extend({
    name:       DS.attr('string'),
    email:      DS.attr('string'),
    plan:       DS.attr('string'),
    createdAt:  DS.attr('date'),
    updatedAt:  DS.attr('date')//,
    //updatedBy:  DS.belongsTo('person', { async: true }),
    //workspaces: DS.hasMany('workspace', { async: true }),
    //users:      DS.hasMany('person', { async: true })
});