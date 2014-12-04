import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		sessionAuthenticationSucceeded: function() {
			console.log('sessionAuthenticationSucceeded : ' + this.get('session'));
			this._super();
		}
	}
});