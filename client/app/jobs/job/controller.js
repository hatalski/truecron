import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['jobs'],
  jobs: Ember.computed.alias("controllers.jobs"),
  showNewTaskForm: false,
  newTask: null,
  actions: {
    addTask: function() {
      "use strict";
      this.set('newTask', this.store.createRecord('task', {
        name: 'new task'
      }));
      this.set('showNewTaskForm', true);
    },
    createTask: function(task) {
      "use strict";
      Ember.Logger.log('new task creation initiated');
      Ember.Logger.log(task);
      var job = this.get('model');
      Ember.Logger.log(job);
      var numberOfTasks = job.get('tasks.length');
      var position = numberOfTasks + 1;
      Ember.Logger.log(position);
      var workspace = job.get('workspace');
      Ember.Logger.log(workspace);
      task.set('jobId', job.get('id'));
      task.set('position', position);
      task.set('settings', '{}');
      task.set('organizationId', workspace.get('organization.id'));
      task.set('workspaceId', workspace.get('id'));
      job.get('tasks').pushObject(task);
      task.save();
      this.set('newTask', null);
      this.set('showNewTaskForm', false);
    },
    cancelTaskCreation: function() {
      "use strict";
      Ember.Logger.log('new task creation cancelled');
      this.set('newTask', null);
      this.set('showNewTaskForm', false);
    }
  }
});
