import DS from 'ember-data';

export default DS.Model.extend({
    name:         DS.attr('string'),
    createdAt:    DS.attr('date'),
    updatedAt:    DS.attr('date'),
    updatedBy:    DS.belongsTo('person', { async: true }),
    jobs:         DS.hasMany('job', { async: true }),
    organization: DS.belongsTo('organization', { async: true })
});
