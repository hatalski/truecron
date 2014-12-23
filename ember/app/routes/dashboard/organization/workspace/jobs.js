import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
	model: function() {
	    var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
	    if (wsp === undefined) {
	    	wsp = this.modelFor('dashboard.organization.workspace');
	    }
	    this.set('workspace', wsp);	    
	    var jobs = wsp.get('jobs');
	    return jobs;
	},
	setupController: function(controller, model) {
	    this.controllerFor('dashboard.organization.workspace.jobs').set('workspace', this.get('workspace'));
	    var organization = this.modelFor('dashboard.organization');
	    this.controllerFor('dashboard').set('choosenOrganization', organization);
	    this.controllerFor('dashboard').set('choosenWorkspace', this.get('workspace'));
	    this._super(controller, model);
    },
	afterModel: function(jobs) {
		Ember.Logger.log('afterModel jobs');
		if (jobs.get('length') > 0) {
			this.transitionTo('dashboard.organization.workspace.jobs.job', jobs.get('firstObject'));
		} else {
			this.transitionTo('dashboard.organization.workspace.jobs');
		}
	}
});
