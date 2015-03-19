import Ember from 'ember';

export default Ember.Controller.extend({
  showJobDetails: false,
  selectedJob: null,
  actions: {
    selectJob: function(job) {
      "use strict";
      Ember.Logger.log('select new job', job);
      this.set('selectedJob', job);
      this.set('showJobDetails', true);
      this.transitionToRoute('jobs.job', job);
    },
    backToJobsList: function() {
      "use strict";
      this.set('showJobDetails', false);
    }
  }
});
