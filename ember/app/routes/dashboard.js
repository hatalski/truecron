import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		// TODO: replace 1 with authenticated user id
		return this.store.find('person', 1);
	},
	afterModel: function() {
		this.transitionTo('dashboard.organization.workspace.jobs', 'Personal', 'Development');
	}
});
