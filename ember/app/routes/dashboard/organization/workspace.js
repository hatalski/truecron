import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function(params) {
		console.log('load workspace model with id : ' + params.workspace_id);
		var workspace = this.store.find('workspace', params.workspace_id);
		return workspace;
	},
	setupController: function(controller, model) {
		console.log('setupController workspace Route');
		if (this.controllerFor('dashboard').get('choosenWorkspace') == null) {
	    	this.controllerFor('dashboard').set('choosenWorkspace', model.get('firstObject'));
		}
	    this._super(controller, model);
    }
});
