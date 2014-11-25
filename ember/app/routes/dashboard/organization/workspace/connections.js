import Ember from 'ember';

export default Ember.Route.extend({
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
    }
});