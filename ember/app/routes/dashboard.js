import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		var user = this.store.find('user', 'current');
		this.get('session').set('user', user);
		// var orgs = this.store.find('organization');
		return user;
	},
	afterModel: function() {
		var self = this;
		self.store.find('organization').then(function(organizations) {
			self.controllerFor('dashboard').set('organizations', organizations);
			Ember.Logger.log('organizations length: %d', organizations.get('length'));
			if (organizations.get('length') > 0) {
				var firstOrg = organizations.get('firstObject');
				self.transitionTo('dashboard.organization', firstOrg);
			}
		});
	}
});
