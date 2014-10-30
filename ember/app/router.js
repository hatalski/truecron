import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.resource('jobs', { path: '/:org_id/:workspace_id/jobs'}, function() {
    this.route('addjob', { path: '/addjob' });
    this.route('job', { path: '/:job_id' }, function() {
      this.resource('tasks', { path: '/tasks' }, function() {
        this.route('task', { path: '/:task_id' });
      });
    });
  });
  //this.resource('jobs/job/tasks', function() { });
  //this.route('jobs/job/tasks/task');
  this.route('jobs/addjob');
});

export default Router;
