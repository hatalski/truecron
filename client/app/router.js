import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
  this.route("signup");
  this.route("signin");
  this.route("forgot");
  this.route("profile");
  this.resource("workspaces", function() {
    "use strict";
    this.route("workspace", { path: "/:workspace_id" }, function() {
      this.route("settings"); // redirect from index when user has access to settings
      this.resource("users", { path: "/members" }, function() {
        this.route("user", { path: "/:id" });
      });
      this.resource("jobs", function() {
        this.route("index");
        this.route('new');
        this.route("job", { path: "/:job_id" }, function() {
          this.resource("tags", function() {
            this.route("tag", { path: "/:id" });
          });
          this.resource("tasks", function() {
            this.route("task", { path: "/:id" });
          });
          this.resource("runs", function() {
            this.route("run", { path: "/:id" });
          });
          this.resource("history", function() {
            this.route("record", { path: "/:id" });
          });
        });
      });
    });
  });
  this.resource("organizations", function() {
    "use strict";
    this.route("organization", { path: "/:id" }, function() {
      this.resource("plans", function() {
        this.route("plan", { path: "/:id" });
      });
      this.resource("users", { path: "/members" }, function() {
        this.route("user", { path: "/:id" });
      });
      this.resource("connections", function() {
        this.route("connection", { path: "/:id" });
      });
      this.resource("vcs");
    });
  });
  this.route('reset');
  this.route('confirmreset');
  this.route('policy', function() {
    this.route('privacy');
    this.route('eula');
  });
});

export default Router;
