import Ember from 'ember';

export default Ember.ArrayController.extend({
	sortProperties: ['position'],
    sortAscending: true,
    itemController: 'dashboard.organization.workspace.tasks.task'
});