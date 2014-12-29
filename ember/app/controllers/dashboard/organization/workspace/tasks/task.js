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
            this.set('currentTaskType', taskType.name);
            this.model.set('taskTypeId', taskType.id);
            this.model.save().then(function(result) {
            	Ember.Logger.info('task type has been changed: ', result);
            }, function(error) {
            	Ember.Logger.error('task type change error: ', error);
            });
        },
        rename: function(task) {
	      Ember.Logger.debug('rename to : ', task.get('name'));
	      task.save().then(function(result) {
            	Ember.Logger.info('task renamed to: ', result);
            }, function(error) {
            	Ember.Logger.error('task rename error: ', error);
            });
	    },
	    delete: function(task) {
	      var job = task.get('job');
	      console.dir('task to remove : ' + job.get('name'));
	      task.deleteRecord();
	      task.save().then(function(result) {
                Ember.Logger.info('task removed: ', result);
	      		this.transitionToRoute('dashboard.organization.workspace.tasks', job.get('workspace'), job);
            }, function(error) {
                Ember.Logger.error('task remove error: ', error);
            });
	    },
	    suspend: function(task) {
	      var active = task.get('active');
	      task.set('active', !active);
	      task.save().then(function(result) {
                Ember.Logger.info('task suspend result: ', result);
            }, function(error) {
                Ember.Logger.error('task suspend error: ', error);
            });
	    }
    }
});
