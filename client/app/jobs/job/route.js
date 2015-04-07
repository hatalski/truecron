import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
    "use strict";
    return this.store.find('job', params.job_id);
  },
  afterModel: function(model) {
    "use strict";
    Ember.Logger.log('Job model: ', model);
    var jobsController = this.controllerFor('jobs');
    Ember.Logger.log('Jobs controller: ', jobsController);
    jobsController.set('selectedJob', model);
    jobsController.set('showJobDetails', true);
  }
});
