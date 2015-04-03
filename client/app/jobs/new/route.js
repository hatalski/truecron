import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    "use strict";
    var selectedJob = this.controllerFor('jobs').get('selectedJob');
    Ember.Logger.log(selectedJob);
    return selectedJob;
  }
});
