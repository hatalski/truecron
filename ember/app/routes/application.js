import Ember from 'ember';
import Notify from 'ember-notify';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		authenticateSession: function() {
			console.log('authenticateSession called');
			this._super();
	    },
		sessionAuthenticationFailed: function() {
			console.log('sessionAuthenticationFailed called');
			//console.dir(error);
			this._super();
			Notify.alert("You can control how long it's displayed.", {
			  closeAfter: 10000 // or set to null to disable auto-hiding
			});
			this.controllerFor('application').set('isLoginError', true);
		},
		sessionAuthenticationSucceeded: function() {
			console.log('sessionAuthenticationSucceeded : ');
			console.dir(this.get('session'));
			this._super();
		}
	}
});