import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
  	console.log('load task with id : ' + params.task_id);
  	return this.store.find('task', params.task_id);
  },
  setupController: function(controller, model) {
  	var self = this;
	  this.controllerFor('dashboard.organization.workspace.tasks.task').set('taskTypes', this.store.find('task-type'));
	  this.store.find('task-type', model.get('taskType.id')).then(function(result) {
		  self.controllerFor('dashboard.organization.workspace.tasks.task').set('currentTaskType', result.get('name'));
	  });
	  this._super(controller, model);
  }
});