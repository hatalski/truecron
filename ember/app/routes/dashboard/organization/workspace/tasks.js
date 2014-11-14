import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log(params.job_id);
		var job = this.modelFor('job');
		console.dir(job);
	    var tasks = this.store.find('task', params.job_id);
	    return tasks;
	}
});
