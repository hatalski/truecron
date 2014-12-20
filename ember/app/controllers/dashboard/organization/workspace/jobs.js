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
		    var workspace = self.get('workspace');
		    var user = self.get('session.user');
		    var newJob = self.store.createRecord('job', {
		    	name: ' unnamed job',
	            workspace: workspace,
		    	startsAt: new Date(),
	            rrule: 'FREQ=MONTHLY;BYDAY=+3TU',
	            active: true,
	            archived: false,
	            updatedBy: user
		    });
		    newJob.save().then(function(result) {
		    	self.transitionToRoute('dashboard.organization.workspace.jobs.job', result);
		    }, function(error) {
		    	console.log(error);
		    });
		}
	}
});
