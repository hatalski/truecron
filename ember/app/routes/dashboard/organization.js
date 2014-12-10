import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function(params) {
		console.log('load organization model with id : ' + params.organization_id);
		return this.store.find('organization', params.organization_id);
	},
	serialize: function(model) {
		return { organization_id: model.get('id') };
	},
	setupController: function(controller, model) {
		if (this.controllerFor('dashboard').get('choosenOrganization') == null) {
	    	this.controllerFor('dashboard').set('choosenOrganization', model.get('firstObject'));
		}
	    this._super(controller, model);
    },
	afterModel: function(organization) {
		console.log('organization afterModel : ' + organization);
		// var self = this;
		// var length = organization.get('workspaces.length');
		// var workspaces = organization.get('workspaces');
		// console.dir('redirect to workspace if any exist : ' + length);
		// if (length > 0) {
		// 	var firstObject = workspaces.get('firstObject');
		// 	self.store.find('workspace', firstObject.get('id')).then(function(workspace) {
		// 		self.transitionTo('dashboard.organization.workspace.jobs', organization, workspace);
		//     });
		// }
	}
});
