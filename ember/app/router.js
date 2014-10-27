import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route('jobs', { path: '/j'});
  this.route('organizations', { path: '/o'}, function() {
    this.route('organization', { path: '/:org_id'}, function() {
      this.route('workspaces');
      this.route('workspace', { path: '/:workspace_id'}, function() {
        this.route('tasks', { path: '/tasks'}, function() {
          this.route('task', { path: '/:task_id'});
        });
      });
    });
  });
});

export default Router;
