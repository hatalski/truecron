import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		console.log('load dashboard route model');
		var orgs = this.store.find('organization');
		var user = this.store.find('user', 'current');
		this.get('session').set('user', user);
		console.dir(this.get('session.user'));
		this.controllerFor('dashboard').set('organizations', orgs);
		//var workspaces = this.store.find('workspace');
		return user;
	},
	afterModel: function(user) {
		var self = this;
		//this.controllerFor('dashboard').set('organizations', orgs);
		var organizations = this.controllerFor('dashboard').get('organizations');
		Ember.Logger.log('organizations length: %d', organizations.get('length'));
		if (organizations.get('length') > 0) {
			var firstOrg = organizations.get('firstObject');
			self.transitionTo('dashboard.organization', firstOrg);
		}
	}
});
