import DS from 'ember-data';

export default DS.Model.extend({
    email:  DS.attr('string'),
    status: DS.attr('string'),
    user:   DS.belongsTo('user', { async: true })
});