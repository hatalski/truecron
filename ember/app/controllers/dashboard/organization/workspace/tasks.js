import Ember from 'ember';

export default Ember.ObjectController.extend({
	// sortProperties: ['position'],
 //    sortAscending: true,
 //    itemController: 'dashboard.organization.workspace.tasks.task'
 	actions: {
        viewtask: function(task) {
            console.dir('task : ' + task);
            console.dir('job : ' + task.get('job.id'));
            this.transitionToRoute('dashboard.organization.workspace.tasks.task', task.get('job.id'), task);
        }
    }
});