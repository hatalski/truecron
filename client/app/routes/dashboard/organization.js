import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function(params) {
		console.log('load organization model with id : ' + params.organization_id);
		return this.store.find('organization', params.organization_id);
	},
	setupController: function(controller, model) {
		if (this.controllerFor('dashboard').get('choosenOrganization') == null) {
	    	this.controllerFor('dashboard').set('choosenOrganization', model.get('firstObject'));
		}
	    this._super(controller, model);
    },
    afterModel: function(organization) {
    	var self = this;
    	organization.get('workspaces').then(function(workspaces) {
    		Ember.Logger.log('workspaces length: %d', workspaces.get('length'));
    		self.transitionTo('dashboard.organization.workspace.jobs', organization, workspaces.get('firstObject'));
    	});
    }
});