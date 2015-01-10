import Ember from 'ember';
import TaskTypes from 'true-cron/models/task-type';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
  	Ember.Logger.debug('load task with id : ', params.task_id);
  	return this.store.find('task', params.task_id);
  },
  setupController: function(controller, model) {
  	var self = this;
	  self.controllerFor('dashboard.organization.workspace.tasks.task').set('taskTypes', TaskTypes);
    var currentTaskType = TaskTypes[model.get('taskTypeId')];
    Ember.Logger.debug('current task-type: ',  currentTaskType.name);
		self.controllerFor('dashboard.organization.workspace.tasks.task').set('currentTaskType', currentTaskType.name);
	  self._super(controller, model);
  }
});