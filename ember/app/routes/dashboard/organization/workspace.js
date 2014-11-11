import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		this.set('workspaceName', params.workspace_name);
		return this.store.find('workspace', { name: params.workspace_name });
	},
	serialize: function(model) {
		return { workspace_name: model.get('name') };
	},
	setupController: function(controller, model) {
	    this.controllerFor('dashboard').set('choosenWorkspace', this.get('workspaceName'));
	    this._super(controller, model);
    }
});
