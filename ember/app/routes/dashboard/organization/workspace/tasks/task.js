import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
  	console.log('load task with id : ' + params.task_id);
  	return this.store.find('task', params.task_id);
  },
  setupController: function(controller, model) {
	this.controllerFor('dashboard.organization.workspace.tasks.task').set('taskTypes', this.store.find('task-type'));
	this._super(controller, model);
  }
});
