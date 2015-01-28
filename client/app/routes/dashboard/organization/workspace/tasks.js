import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function(params) {
		Ember.Logger.debug('load model for tasks with job id : ', params.job_id);
	    return this.store.find('job', params.job_id);
	},
	afterModel: function(job) {
		var self = this;
		var length = job.get('tasks.length');
		var tasks = job.get('tasks');
		Ember.Logger.debug('redirect to task if any exist : ', length);
		if (length > 0) {
			var firstTask = tasks.get('firstObject');
			this.store.find('task', firstTask.get('id')).then(function(fullTask) {
				self.transitionTo('dashboard.organization.workspace.tasks.task', job.get('id'), fullTask);
		    });
		}
	}
});
