import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		// TODO: replace 1 with authenticated user id
		return this.store.find('person', 1);
	},
	afterModel: function(person) {
		var self = this;
		var length = person.get('organizations.length');
		var organizations = person.get('organizations');
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
