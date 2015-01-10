import Ember from 'ember';
import {configurable} from 'torii/configuration';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
	serverSignUpEndpoint: configurable('serverSignUpEndpoint'),
	actions: {
		authenticateSession: function() {
			Ember.Logger.log('authenticateSession called');
			this._super();
	    },
		sessionAuthenticationFailed: function() {
			Ember.Logger.log('sessionAuthenticationFailed called');
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
			var self = this;
			var session = this.get('session');
			Ember.Logger.log('sessionAuthenticationSucceeded : ');
			Ember.Logger.log(session);
			if (session.get('authenticator') === 'simple-auth-authenticator:torii') {
				Ember.Logger.log('authenticator: simple-auth-authenticator:torii');
				var email = session.get('userEmail');
				var profile = session.get('profile');
				profile.provider = 'google';
				var requestData = {
					email: email, 
					name: profile.displayName, 
					extensionData: profile
				};

				var result = Ember.$.ajax(self.get('serverSignUpEndpoint'), {
					type: 'POST',
					contentType: 'application/json',
					dataType: 'json',
					data: JSON.stringify(requestData),
					crossDomain: true
				});
				result.success(function(response) {
					Ember.Logger.log('sign up success');
					Ember.Logger.log(response);
					var options = { identification: session.get('userEmail'), grant_type: 'http://google.com' };
					self.get('session').authenticate('authenticator:truecron', options)
					.then(function(result) {
						Ember.Logger.log('on authenticate result');
						Ember.Logger.log(result);
						self.transitionTo('dashboard');
					}).catch(Ember.Logger.error);
				});
				result.error(function(error) {
					Ember.Logger.log('sign up error');
					Ember.Logger.log(error);
					var options = { identification: session.get('userEmail'), grant_type: 'http://google.com' };
					self.get('session').authenticate('authenticator:truecron', options)
					.then(function(result) {
						Ember.Logger.log('on authenticate result');
						Ember.Logger.log(result);
						self.transitionTo('dashboard');
					}).catch(Ember.Logger.error);
					return { error: error };
				});
			} else {
				Ember.Logger.log('authenticator: authenticator:application');
				this._super();
			}
		}
	}
});