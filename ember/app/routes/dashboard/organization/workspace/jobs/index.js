import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
		if (wsp === undefined) {
			wsp = this.modelFor('dashboard.organization.workspace');
		}
		return wsp;
	},
	afterModel: function(workspace) {
		Ember.Logger.log('afterModel jobs.index');
		if (workspace.get('jobs.length') > 0) {
			this.transitionTo('dashboard.organization.workspace.jobs.job', workspace.get('jobs.firstObject'));
		} else {
			this.transitionTo('dashboard.organization.workspace.jobs');
		}
	}
});
