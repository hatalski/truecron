import DS from 'ember-data';

export default DS.Model.extend({
    name:      DS.attr('string'),
    active:    DS.attr('boolean'),
    settings:  DS.attr('string'),
    position:  DS.attr('number'),
    timeout:   DS.attr('number'),
    createdAt: DS.attr('date'),
    updatedAt: DS.attr('date'),
    updatedBy: DS.belongsTo('person', { async: true }),
    job:       DS.belongsTo('job', { async: true }),
    taskType:  DS.belongsTo('task-type', { async: true })
});
