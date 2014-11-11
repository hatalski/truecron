import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		this.set('organizationName', params.organization_name);
		return this.store.find('organization', { name: params.organization_name });
	},
	serialize: function(model) {
		return { organization_name: model.get('name') };
	},
	setupController: function(controller, model) {
	    this.controllerFor('dashboard').set('choosenOrganization', this.get('organizationName'));
	    this._super(controller, model);
    }
});
