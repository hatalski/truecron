import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel: function() {
    	this.transitionTo('dashboard.organization.workspace.tasks.rrule');
    }
});
