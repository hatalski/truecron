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
        }
    }
});
