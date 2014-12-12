import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
		console.log('get workspace model for jobs Route');
	    var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
	    if (wsp === undefined) {
	    	wsp = this.modelFor('dashboard.organization.workspace');
	    }
		console.log('set workspace model for jobs Route');
	    this.set('workspace', wsp);
	    var jobs = wsp.get('jobs');
	    return jobs;
	},
	setupController: function(controller, model) {
		console.log('set workspace in setupController of jobs Route');
	    this.controllerFor('dashboard.organization.workspace.jobs').set('workspace', this.get('workspace'));
	    // var organization = this.controllerFor('dashboard').get('choosenOrganization');
	    // var workspace = this.controllerFor('dashboard').get('choosenWorkspace');
	    // var workspaceModel = this.modelFor('dashboard.organization.workspace');
	    // console.log(workspaceModel.get('id'));
	    // console.dir(organization);
	    // console.dir(workspace);
	    this._super(controller, model);
    },
	afterModel: function(jobs) {
		if (jobs.get('length') > 0) {
			this.transitionTo('dashboard.organization.workspace.jobs.job', jobs.get('firstObject'));
		} else {
			this.transitionTo('dashboard.organization.workspace.jobs');
		}
	}
});
