import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		// TODO: replace 1 with authenticated user id
		return this.store.find('person', 1);
	},
	afterModel: function() {
		//console.dir('dashboard afterModel : ' + person.get('organizations').get('firstObject'));
		//this.transitionTo('dashboard.organization', 'Personal');
	}
});
