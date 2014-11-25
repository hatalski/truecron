import DS from 'ember-data';

export default DS.Model.extend({
	output: DS.attr('string'),
	runAt:  DS.attr('date'),
	job:    DS.belongsTo('job', { async: true })
});
