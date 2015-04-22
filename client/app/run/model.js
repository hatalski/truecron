import DS from 'ember-data';

export default DS.Model.extend({
    startedAt:    DS.attr('date'),
    startedByPerson:    DS.belongsTo('user', { async: true }),
    elapsed:      DS.attr('number'),
    status:       DS.attr('number'),
    message:      DS.attr('string'),
    organization: DS.belongsTo('organization', { async: true }),
    workspace:    DS.belongsTo('workspace', { async: true }),
    job:          DS.belongsTo('job', { async: true })
});
