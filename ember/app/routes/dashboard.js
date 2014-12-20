import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		console.log('load dashboard route model');
		var orgs = this.store.find('organization');
		var user = this.store.find('user', 'current');
		this.controllerFor('dashboard').set('organizations', orgs);
		//var workspaces = this.store.find('workspace');
		return user;
	},
	afterModel: function(user) {
		//var self = this;
		//this.controllerFor('dashboard').set('organizations', orgs);
		var organizations = this.controllerFor('dashboard').get('organizations');
		Ember.Logger.log('organizations length: %d', organizations.get('length'));
		if (organizations.get('length') > 0) {
			var firstOrg = organizations.get('firstObject');
			var workspaces = firstOrg.get('workspaces');
			Ember.Logger.log('workspaces length: %d', workspaces.get('length'));
			if (workspaces.get('length') > 0) {
				var firstWorkspace = workspaces.get('firstObject');
				self.transitionTo('dashboard.organization.workspace.jobs', firstOrg, firstWorkspace);
				self.controllerFor('dashboard').set('choosenOrganization', firstOrg);
				self.controllerFor('dashboard').set('choosenWorkspace', firstWorkspace);
			}
		}
	}
});
