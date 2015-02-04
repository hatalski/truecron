import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  // these routes will be removed
  this.resource('dashboard', function() {
    this.route('organization', { path: '/:organization_id' }, function() {
      this.route('workspace', { path: '/:workspace_id' }, function() {
        this.route('jobs', { path: '/jobs' }, function() {
          this.route('new');
          this.route('job', { path: '/:job_id' }, function() {
            this.route('tasks', function() {
              this.route('index');
              this.route('task', { path: '/:task_id' });
            });
          }); // job details with jobs list on the left side
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

  // -----------------------------------------------------------

  // new routes
  this.route("signup");
  this.route("signin");
  this.route("forgot");
  this.route("profile");
  this.resource("workspaces", function() {
    "use strict";
    this.route("workspace", { path: "/:workspace_id" }, function() {
      this.resource("collaborators", function() {
        this.route("user", { path: "/:user_id" });
      });
      this.resource("settings");
      this.resource("jobs", function() {
        this.route("index");
        this.route("job", { path: "/:job_id" }, function() {
          this.resource("tasks", function() {
            this.route('task', { path: '/:task_id' });
          });
        });
      });
    });
  });
  this.resource("organizations", function() {
    "use strict";
    this.route("organization", { path: "/:organization_id" }, function() {
      this.resource("plans", function() {
        this.route("plan", { path: "/:plan_id" });
      });
      this.resource("members", function() {
        this.route("user", { path: "/:user_id" });
      });
      this.resource("connections", function() {
        this.route("connection", { path: "/:connection_id" });
      });
      this.resource("vcs");
    });
  });
});

export default Router;
