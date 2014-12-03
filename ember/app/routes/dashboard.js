import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		console.log('load dashboard route model');
		console.dir('session ' + this.get('session'));
		return this.store.find('user', 'current');
	},
	afterModel: function(user) {
		var self = this;
		var length = user.get('organizations.length');
		var organizations = user.get('organizations');
		console.dir('redirect to organization if any exist : ' + length);
		if (length > 0) {
			var firstOrganization = organizations.get('firstObject');
			self.store.find('organization', firstOrganization.get('id')).then(function(org) {
				if (org.get('workspaces.length') > 0 ) {
					var firstWorkspace = org.get('workspaces.firstObject');
					self.store.find('workspace', firstWorkspace.get('id')).then(function(workspace) {
						self.transitionTo('dashboard.organization.workspace.jobs', org, workspace);
						self.controllerFor('dashboard').set('choosenOrganization', org);
						self.controllerFor('dashboard').set('choosenWorkspace', workspace);
					});
				}
		    });
		}
	}
});
