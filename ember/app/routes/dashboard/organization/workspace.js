import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log('load workspace model with name : ' + params.workspace_name);
		return this.store.find('workspace', { name: params.workspace_name });
	},
	serialize: function(model) {
		return { workspace_name: model.get('name') };
	},
	setupController: function(controller, model) {
		if (this.controllerFor('dashboard').get('choosenWorkspace') == null) {
	    	this.controllerFor('dashboard').set('choosenWorkspace', model.get('firstObject'));
		}
	    this._super(controller, model);
    },
    afterModel: function(workspace) {
		console.log('afterModel' + workspace);
		// if (workspace.get('firstObject') === undefined) {
		// 	this.controllerFor('dashboard').set('choosenWorkspace', workspace.get('name'));
		// } else {
		// 	this.controllerFor('dashboard').set('choosenWorkspace', workspace.get('firstObject'));
		// }
	}
});
