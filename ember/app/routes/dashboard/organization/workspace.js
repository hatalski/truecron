import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function(params) {
		console.log('load workspace model with id : ' + params.workspace_id);
		return this.store.find('workspace', params.workspace_id);
	},
	serialize: function(model) {
		return { workspace_id: model.get('id') };
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
