import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('organization');
	},
	afterModel: function(organizations, transition) {
		console.log(organizations);
		console.log(transition);
		console.log(organizations.get('length'));
	    if (organizations.get('length') >= 1) {
	      this.transitionTo('dashboard.organization.workspace', organizations.get('firstObject'));
	    }
	}
});
