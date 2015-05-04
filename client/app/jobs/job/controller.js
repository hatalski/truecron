import Ember from 'ember';
import RRuleParser from 'true-cron/mixins/rrule-parser';

export default Ember.Controller.extend(RRuleParser, {
  needs: ['jobs'],
  jobs: Ember.computed.alias("controllers.jobs"),

    // user is populated from a route afterModel
  user: null,

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
      this.get('websocket').sendMessage('test');
      job.get('tags').pushObject(tagName);
      job.save();
    },
    runJob: function() {
        "use strict";
        this.get('websocket').sendMessage('running job');
        var job = this.get('model');
        var user = this.get('user');
        Ember.Logger.log('user in run job: ', user);
        var newRun = this.store.createRecord('run', {
            startedAt: moment().toDate(),
            startedByPerson: user,
            elapsed: 0,
            status: 15,
            job: job,
            message: '',
            workspace: job.get('workspace'),
            organization: job.get('workspace.organization')
        });
        newRun.save().then(function(savedRun) {
            job.get('runs').pushObject(savedRun);
        });
    },
    removeJob: function(done) {
      "use strict";
      var job = this.get('model');
      job.deleteRecord();
      job.save().then(done);
    }
  }
});
