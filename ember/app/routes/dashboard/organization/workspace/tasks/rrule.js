import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		var job = this.modelFor('dashboard.organization.workspace.tasks');
		console.dir('model for rrule : ' + job);
	    return job.get('rrule');
	}
});