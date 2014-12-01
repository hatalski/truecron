import Ember from 'ember';

export default Ember.ObjectController.extend({
	currentTaskType: null,
	taskTypes: null,
	taskTypePartial: function() {
		var typeName = this.get('currentTaskType');
		if (typeName == null) {
			return "dashboard/organization/workspace/tasks/tasktype-empty";
		}
		var templateName = "dashboard/organization/workspace/tasks/tasktype-" + typeName;
		return templateName;
	}.property('currentTaskType'),
	actions: {
        changeType: function(taskType) {
            this.set('currentTaskType', taskType.get('name'));
            this.model.set('taskType', taskType);
            this.model.save();
        },
        rename: function(task) {
	      console.log('rename to : ' + task.get('name'));
	      task.save();
	    },
	    delete: function(task) {
	      var job = task.get('job');
	      console.dir('task to remove : ' + job.get('name'));
	      task.deleteRecord();
	      task.save();
	      //this.transitionToRoute('dashboard.organization.workspace.jobs', job.get('workspace'));
	      this.transitionToRoute('dashboard.organization.workspace.tasks', job.get('workspace'), job);
	    },
	    suspend: function(task) {
	      var active = task.get('active');
	      task.set('active', !active);
	      task.save();
	    }
    }
});
