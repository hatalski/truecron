import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('profile');
  this.resource('dashboard', function() { 
    this.route('organization', { path: '/:organization_id' }, function() {
      this.route('workspace', { path: '/:workspace_id' }, function() {
        this.route('jobs', { path: '/jobs' }, function() {
          this.route('new');
          this.route('job', { path: '/:job_id' }); // job details with jobs list on the left side
        });
        this.route('tasks', { path: '/jobs/:job_id/tasks' }, function() { // job details full screen
          //this.route('rrule'); // scheduler UI on the right side
          this.route('index');
          this.route('task', { path: '/:task_id' }); // task details on the right side
        });
        this.route('connections', { path: '/connections' }, function() { // job details full screen
          this.route('index'); // explain connections
          this.route('connection', { path: '/:connection_id' }); // task details on the right side
        });
      });
    });
  });
});

export default Router;