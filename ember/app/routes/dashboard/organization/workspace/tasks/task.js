import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
  	console.log('load task with id : ' + params.task_id);
  	return this.store.find('task', params.task_id);
  },
  setupController: function(controller, model) {
  	var self = this;
	  this.controllerFor('dashboard.organization.workspace.tasks.task').set('taskTypes', this.store.find('task-type'));
	  var taskTypeToFind = model.get('taskType.id');
    console.dir('taskTypeToFind:');
    console.dir(taskTypeToFind);
    this.store.find('task-type', taskTypeToFind).then(function(result) {
		  self.controllerFor('dashboard.organization.workspace.tasks.task').set('currentTaskType', result.get('name'));
	  });
	  this._super(controller, model);
  }
});