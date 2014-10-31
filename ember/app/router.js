import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.resource('jobs', { path: '/:org_id/:workspace_id/jobs'}, function() {
      this.route('addjob', { path: '/new' });
      this.route('job', { path: '/:job_id' }, function() { // job details with jobs list on the left side
        this.route('details', { path: '/tasks' }, function() { // job details full screen
          this.route('index'); // scheduler UI on the right side
          this.route('task', { path: '/:task_id' }); // task details on the right side
        });
      });
  });
});

export default Router;