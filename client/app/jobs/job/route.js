import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    "use strict";

    // set user for job controller
    var jobController = this.controllerFor('jobs.job');
    jobController.set('user', this.store.find('user', this.get('session.userId')));
    return this.store.find('job', params.job_id);
  },
  afterModel: function(model) {
    "use strict";

    // set jobs controller states
    Ember.Logger.log('Job model: ', model);
    var jobsController = this.controllerFor('jobs');
    Ember.Logger.log('Jobs controller: ', jobsController);
    jobsController.set('selectedJob', model);
    jobsController.set('showJobDetails', true);
  }
});
