import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		// TODO: replace 1 with authenticated user id
		return this.store.find('person', 1);
	},
	afterModel: function(person) {
		console.log('dashboard afterModel : ' + person.get('organizations.firstObject').get('name'));
		//this.transitionTo('dashboard.organization.workspace.jobs', 'Personal', 'Development');
	}
});
