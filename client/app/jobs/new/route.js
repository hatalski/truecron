import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
      "use strict";
      var workspace = this.modelFor('workspaces/workspace');
      var userId = this.get('session.userId');
      Ember.Logger.log('session user id: ', userId);
      var newJob = this.store.createRecord('job', {
          name: '',
          workspace: workspace,
          workspaceId: workspace.get('id'),
          updatedBy: userId
      }); //this.controllerFor('jobs').get('newJob');
      this.controllerFor('jobs').set('selectedJob', newJob);
      this.controllerFor('jobs').set('showJobDetails', true);
      Ember.Logger.log('new job on new route: ', newJob);
      return newJob;
  },
  afterModel: function(model) {
    "use strict";
    if (!model) {
      this.transitionTo('jobs');
    }
  }
});
