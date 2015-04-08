import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['jobs'],
  jobs: Ember.computed.alias("controllers.jobs"),

  websocket: Ember.inject.service(),

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
      var job = this.get('model');
      var numberOfTasks = job.get('tasks.length');
      var position = numberOfTasks + 1;
      Ember.Logger.log(position);
      task.set('jobId', job.get('id'));
      task.set('position', position);
      task.set('settings', '{}');
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
    },
    addJobTag: function(tagName) {
      "use strict";
      var job = this.get('model');
      //var newTag = this.store.createRecord('job-tag', {
      //  name: tagName,
      //  job: job
      //});
      //if (!job.get('tags')) {
      //    job.set('tags', []);
      //}
      job.get('tags').pushObject(tagName);
      job.save();
    }
  }
});
