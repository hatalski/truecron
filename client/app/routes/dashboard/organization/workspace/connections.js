import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
	    //var workspace = params.workspace_id;
	    //var organization = params.org_id;
	    //this.set('params', params);
	    return this.store.find('connection');
	},
	setupController: function(controller, model) {
		//controller.set('current', this.get('params'));
	    //this.controllerFor('dashboard').set('test', this.get('params'));
	    this._super(controller, model);
    },
	afterModel: function(connections) {
		var self = this;
		if (connections.get('length') > 0) {
			self.transitionTo('dashboard.organization.workspace.connections.connection', connections.get('firstObject'));
		} else {
			self.transitionTo('dashboard.organization.workspace.connections');
		}
	}
});