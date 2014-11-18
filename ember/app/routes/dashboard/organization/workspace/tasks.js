import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log('load model for tasks with job id : ' + params.job_id);
	    var job = this.store.find('job', params.job_id);
	    return job;
	},
    afterModel: function(job) {
		console.log('afterModel tasks route : ' + job);
		//this.transitionToRoute('dashboard.organization.workspace.tasks.rrule', job);
		// if (job.get('firstObject') === undefined) {
		// 	this.transitionToRoute('dashboard.organization.workspace.tasks.rrule', job);
		// } else {
		// 	this.transitionToRoute('dashboard.organization.workspace.tasks.rrule', job.get('firstObject'));
		// }
	}
});
