import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		authenticateSession: function() {
			console.log('authenticateSession called');
			this._super();
	    },
		sessionAuthenticationFailed: function() {
			console.log('sessionAuthenticationFailed called');
			Ember.$('#loginPassword').popover({
				title: 'Authentication failed.',
				content: 'Please check your credentials and try again.',
				placement: 'bottom',
				trigger: 'manual'
			});
			Ember.$('#loginPassword').popover('show');
			this._super();
		},
		sessionAuthenticationSucceeded: function() {
			console.log('sessionAuthenticationSucceeded : ');
			console.dir(this.get('session'));
			Ember.$('#loginPassword').popover('hide');
			this._super();
		}
	}
});