import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    "use strict";
    var selectedJob = this.controllerFor('jobs').get('newJob');
    Ember.Logger.log('new job on new route: ', selectedJob);
    return selectedJob;
  },
  afterModel: function(model) {
    "use strict";
    if (!model) {
      this.transitionTo('jobs');
    }
  }
});
