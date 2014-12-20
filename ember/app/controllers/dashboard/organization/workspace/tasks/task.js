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
            this.model.save().then(function(result) {
            	console.log('task type has been changed');
            	console.dir(result);
            }, function(error) {
            	console.log('task type change error');
            	console.dir(error);
            });
        },
        rename: function(task) {
	      console.log('rename to : ' + task.get('name'));
	      task.save().then(function(result) {
            	console.log('task renamed to: ');
            	console.dir(result);
            }, function(error) {
            	console.log('task rename error');
            	console.dir(error);
            });
	    },
	    delete: function(task) {
	      var job = task.get('job');
	      console.dir('task to remove : ' + job.get('name'));
	      task.deleteRecord();
	      task.save().then(function(result) {
            	console.log('task removed: ');
            	console.dir(result);
	      		this.transitionToRoute('dashboard.organization.workspace.tasks', job.get('workspace'), job);
            }, function(error) {
            	console.log('task remove error');
            	console.dir(error);
            });
	    },
	    suspend: function(task) {
	      var active = task.get('active');
	      task.set('active', !active);
	      task.save().then(function(result) {
            	console.log('task suspend result: ');
            	console.dir(result);
            }, function(error) {
            	console.log('task suspend error');
            	console.dir(error);
            });
	    }
    }
});
