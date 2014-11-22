import Ember from 'ember';

export default Ember.ArrayController.extend({
	needs: ['dashboard', 'dashboard/organization', 'dashboard/organization/workspace'],
    sortProperties: ['name'],
    sortAscending: true,
    itemController: 'dashboard.organization.workspace.jobs.job',
	actions: {
		addjob: function() {
		    var self = this;
		    var store = this.store;
		    var workspace = this.get('controllers.dashboard.organization.workspace');
		    console.dir('found workspace : ' + workspace);
		    //var workspace = this.modelFor('dashboard.organization.workspace');
		    var newJob = store.createRecord('job', {
		    	name: 'unnamed job',
	            workspace: workspace,
		    	startsAt: new Date(),
	            rrule: 'FREQ=MONTHLY;BYDAY=+3TU',
	            active: true,
	            archived: false
		    });
		    self.transitionToRoute('dashboard.organization.workspace.jobs.job', newJob);
		    // store.find('task-type', 7).then(function(emptyTaskType) {
		    //     var newTask = store.createRecord('task', {
		    //         name: 'unnamed',
		    //         settings: '{}',
		    //         position: job.get('tasks.length') + 1,
		    //         job: job,
		    //         taskType: emptyTaskType
		    //     });
		    //     console.dir('new task is created: ' + newTask);
		    //     self.transitionToRoute('dashboard.organization.workspace.tasks.task', newTask.get('job.id'), newTask);
		    // });
		}
	}
});
