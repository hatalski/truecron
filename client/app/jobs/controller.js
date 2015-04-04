import Ember from 'ember';

export default Ember.Controller.extend({
  showJobDetails: false,
  selectedJob: null,
  actions: {
    selectJob: function(job) {
      "use strict";
      Ember.Logger.log('select new job', job);
      // this.set('selectedJob', job);
      this.set('showJobDetails', true);
      this.transitionToRoute('jobs.job', job);
    },
    backToJobsList: function() {
      "use strict";
      this.set('showJobDetails', false);
      //this.transitionToRoute('jobs', this.get('model.workspace'));
    },
    changeWorkspace: function(workspace) {
      "use strict";
      this.set('selectedJob', null);
      this.set('showJobDetails', false);
      this.transitionToRoute('jobs', workspace);
    },
    newJobClicked: function() {
      "use strict";
      var self = this;
      var jobs = self.get('model.workspace.jobs');
      Ember.Logger.log(jobs);
      var newJob = self.store.createRecord('job', {
        name: '',
        organizationId: self.get('model.workspace.organization.id')
      });
      self.set('selectedJob', newJob);
      self.set('showJobDetails', true);
      jobs.pushObject(newJob);
      self.transitionToRoute('jobs.new');
    }
  }
});
