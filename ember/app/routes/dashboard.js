import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		console.log('load dashboard route model');
		console.dir('session ' + this.get('session'));
		return this.store.find('user', 'current');
	},
	afterModel: function() {
		var self = this;
		self.store.find('organization').then(function(orgs) {
			console.dir('orgs : ' + orgs);
			if (orgs.get('length') > 0) {
				var firstOrg = orgs.get('firstObject');
				console.log('first organization : ' + firstOrg.get('workspaces.length'));
				// self.store.findHasMany(firstOrg, 'workspaces').then(function(workspaces) {
				// 	console.dir('workspaces : ' + workspaces);
				// });
			}
		});
		// var length = user.get('organizations.length');
		// var organizations = user.get('organizations');
		// console.dir('redirect to organization if any exist : ' + length);
		// if (length > 0) {
		// 	var firstOrganization = organizations.get('firstObject');
		// 	self.store.find('organization', firstOrganization.get('id')).then(function(org) {
		// 		if (org.get('workspaces.length') > 0 ) {
		// 			var firstWorkspace = org.get('workspaces.firstObject');
		// 			self.store.find('workspace', firstWorkspace.get('id')).then(function(workspace) {
		// 				self.transitionTo('dashboard.organization.workspace.jobs', org, workspace);
		// 				self.controllerFor('dashboard').set('choosenOrganization', org);
		// 				self.controllerFor('dashboard').set('choosenWorkspace', workspace);
		// 			});
		// 		}
		//     });
		// }
	}
});
