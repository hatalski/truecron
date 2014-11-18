import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log('load model for tasks with job id : ' + params.job_id);
	    var job = this.store.find('job', params.job_id);
	    return job;
	}
});
