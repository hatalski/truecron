import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
  	var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
    if (wsp === undefined) {
    	wsp = this.modelFor('dashboard.organization.workspace');
    }
    return wsp;
  }
});
