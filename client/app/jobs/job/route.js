import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    "use strict";
    Ember.Logger.log('job model params: ', params.job_id);
    return this.store.find('job', params.job_id);
  },
  afterModel: function(model) {
    "use strict";

    // set user for job controller
    var jobController = this.controllerFor('jobs.job');
    var userId = this.get('session.userId');
    Ember.Logger.log('job after model userid', userId);
    if (userId) {
      jobController.set('user', this.store.find('user', userId));
    }
    // set jobs controller states
    Ember.Logger.log('Job model: ', model);
    var jobsController = this.controllerFor('jobs');
    Ember.Logger.log('Jobs controller: ', jobsController);
    jobsController.set('selectedJob', model);
    jobsController.set('showJobDetails', true);
  }
});
