import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.resource('jobs', { path: '/:org_id/:workspace_id/jobs'}, function() {
    this.route('job', { path: '/:job_id' }, function() {
      this.resource('tasks', { path: '/tasks' });
    });
  });
});

export default Router;
