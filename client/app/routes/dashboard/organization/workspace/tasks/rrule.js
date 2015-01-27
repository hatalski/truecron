import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		var job = this.modelFor('dashboard.organization.workspace.tasks');
		console.dir('model for rrule : ' + job);
	    return job.get('rrule');
	}
});