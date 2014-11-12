import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true,
  itemController: 'dashboard.organization.workspace.jobs.job'//,
  // queryParams: ['tab'],
  // tab: 'jobslist',
  // isJobsList: function() {
  //   if (this.get('tab') === "jobslist") {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }.property('tab')
});
