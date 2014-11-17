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
		console.log('afterModel' + organization);
		// if (organization.get('firstObject') === undefined) {
		// 	this.controllerFor('dashboard').set('choosenOrganization', organization.get('name'));
		// } else {
		// 	this.controllerFor('dashboard').set('choosenOrganization', organization.get('firstObject'));
		// }
	}
});
