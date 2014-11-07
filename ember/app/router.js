import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.resource('jobs', { path: '/:org_id/:workspace_id/jobs'}, function() {
    this.route('new');
    this.route('job', { path: '/:job_id' }); // job details with jobs list on the left side
  });
  this.route('tasks', { path: '/:org_id/:workspace_id/jobs/:job_id/tasks' }, function() { // job details full screen
    this.route('index'); // scheduler UI on the right side
    this.route('new');
    this.route('task', { path: '/:task_id' }); // task details on the right side
  });
  this.resource('dashboard', { path: '/d' }, function() { 
    this.route('organization', { path: '/:org_id' }, function() {
      this.route('workspace', { path: '/:workspace_id' }, function() {
        this.route('jobs', { path: '/jobs' }, function() {
          this.route('new');
          this.route('job', { path: '/:job_id' }); // job details with jobs list on the left side
        });
      });
    });
  });
});

export default Router;