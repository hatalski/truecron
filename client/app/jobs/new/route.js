import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
      "use strict";
      var workspace = this.modelFor('workspaces/workspace');
      var user = this.controllerFor('jobs.new').get('user');
      Ember.Logger.log('session user id: ', user);
      Ember.Logger.log('session', this.get('session'));
      var newJob = this.store.createRecord('job', {
          name: '',
          workspace: workspace,
          workspaceId: workspace.get('id'),
          updatedBy: user
      }); //this.controllerFor('jobs').get('newJob');
      this.controllerFor('jobs').set('selectedJob', newJob);
      this.controllerFor('jobs').set('showJobDetails', true);
      Ember.Logger.log('new job on new route: ', newJob);
      return newJob;
  },
    beforeModel: function() {
        // set user for job controller
        var jobController = this.controllerFor('jobs.new');
        var userId = this.get('session.userId');
        Ember.Logger.log('job after model userid', userId);
        if (userId) {
            jobController.set('user', this.store.find('user', userId));
        }
    },
  afterModel: function(model) {
      "use strict";
      if (!model) {
          this.transitionTo('jobs');
      }
  }
});
