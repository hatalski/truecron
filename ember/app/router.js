import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.resource('jobs', { path: '/:org_id/:workspace_id/jobs'}, function() {
      this.route('addjob', { path: '/new' });
      this.route('job', { path: '/:job_id' }, function() {
          this.resource('tasks', { path: '/tasks' }, function() {
              this.route('task', { path: '/:task_id' });
          });
      });
  });
  this.resource('jobdetails', { path: '/jobs/:job_id' }, function() {
      this.route('addtask', { path: '/new' });
      this.route('taskdetails', { path: '/:task_id' });
  });
  this.route('jobdetails/taskdetails');
});

export default Router;
