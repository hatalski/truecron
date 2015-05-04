import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
      "use strict";

      var newJob = this.store.createRecord('job', {
          name: ''
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
