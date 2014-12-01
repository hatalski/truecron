import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log('load organization model with name : ' + params.organization_name);
		return this.store.find('organization', { name: params.organization_name });
	},
	serialize: function(model) {
		return { organization_name: model.get('name') };
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
