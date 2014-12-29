import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
	actions: {
		googleLogin: function() {
			Ember.Logger.log('google login initiated');
			var self = this;
			this.get('session').authenticate('simple-auth-authenticator:torii', 'google-token')
			.then(function(data) {
				Ember.Logger.log(data);
				Ember.Logger.log('SUCCESS ' + self.get('session.token'));
				//var options = { identification: email, password: '007' };
				//self.get('session').authenticate('authenticator:truecron', options);
			});
		}
	}
});