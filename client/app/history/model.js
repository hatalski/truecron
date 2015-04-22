import DS from 'ember-data';

export default DS.Model.extend({
    change:       DS.attr(),
    oldValue:     DS.attr(),
    operation:    DS.attr('string'),
    entity:       DS.attr('string'),
    createdAt:    DS.attr('date'),
    organization: DS.belongsTo('organization', { async: true }),
    workspace:    DS.belongsTo('workspace', { async: true }),
    job:          DS.belongsTo('job',  { async: true }),
    task:         DS.belongsTo('task', { async: true }),
    user:         DS.belongsTo('user', { async: true }),
    updatedBy:    DS.belongsTo('user', { async: true })
});
