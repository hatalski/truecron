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
