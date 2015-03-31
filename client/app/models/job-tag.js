import DS from 'ember-data';

var JobTag = DS.Model.extend({
    name: DS.attr('string'),
    job:  DS.belongsTo('job', { async: true })
});

export default JobTag;
