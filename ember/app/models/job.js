import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    startsAt: DS.attr('date'),
    rrule: DS.attr('string'),
    active: DS.attr('boolean'),
    archived: DS.attr('boolean'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    updatedBy: DS.belongsTo('person', { async: true }),
    workspace: DS.belongsTo('workspace', { async: true }),
    tasks: DS.hasMany('task', { async: true })
});
