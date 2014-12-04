import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
  	var wsp = this.modelFor('dashboard.organization.workspace').get('firstObject');
    if (wsp === undefined) {
    	wsp = this.modelFor('dashboard.organization.workspace');
    }
    return wsp;
  }
});
