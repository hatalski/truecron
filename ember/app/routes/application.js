import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	actions: {
		googleLogin: function() {
			this.get('session').authenticate('simple-auth-authenticator:torii', 'google-token');
			return;
		},
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
			setTimeout(function(){
				Ember.$('#loginPassword').popover('hide');
			}, 5000);
			this._super();
		},
		sessionAuthenticationSucceeded: function() {
			console.log('sessionAuthenticationSucceeded : ');
			console.dir(this.get('session'));
			this._super();
		}
	}
});