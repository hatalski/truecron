import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['dashboard', 'dashboard/organization', 'dashboard/organization/workspace'],
    sortProperties: ['name'],
    sortAscending: true,
    itemController: 'dashboard.organization.workspace.jobs.job',
    workspace: null,
	actions: {
		addjob: function() {
		    var self = this;
		    var store = this.store;
		    var workspace = this.get('workspace');
		    console.dir('found workspace : ' + workspace);
		    var newJob = store.createRecord('job', {
		    	name: ' unnamed job',
	            workspace: workspace,
		    	startsAt: new Date(),
	            rrule: 'FREQ=MONTHLY;BYDAY=+3TU',
	            active: true,
	            archived: false
		    });
		    self.transitionToRoute('dashboard.organization.workspace.jobs.job', newJob);
		}
	}
});
