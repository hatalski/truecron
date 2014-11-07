import Ember from 'ember';

export default Ember.ArrayController.extend({
  sortProperties: ['name'],
  sortAscending: true,
  itemController: 'jobs.job',
  queryParams: ['tab'],
  tab: 'jobslist'
});
