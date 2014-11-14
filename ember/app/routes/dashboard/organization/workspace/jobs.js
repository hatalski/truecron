import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
	    var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
	    if (wsp === undefined) {
	    	wsp = this.modelFor('dashboard.organization.workspace');
	    }
	    var jobs = wsp.get('jobs');
	    return jobs;
	},
	setupController: function(controller, model) {
		//controller.set('current', this.get('params'));
	    //this.controllerFor('dashboard').set('test', this.get('params'));
	    // var organization = this.controllerFor('dashboard').get('choosenOrganization');
	    // var workspace = this.controllerFor('dashboard').get('choosenWorkspace');
	    // var workspaceModel = this.modelFor('dashboard.organization.workspace');
	    // console.log(workspaceModel.get('id'));
	    // console.dir(organization);
	    // console.dir(workspace);
	    this._super(controller, model);
    }
});
