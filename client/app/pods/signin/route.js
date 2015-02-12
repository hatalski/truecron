import Ember from 'ember';
import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  actions: {
    googleLogin: function() {
      Ember.Logger.log('google login initiated');
      var self = this;
      self.get('session').authenticate('simple-auth-authenticator:torii', 'google-token')
        .then(function() {
          var session = self.get('session');
          if (session.get('authenticator') === 'authenticator:truecron') {
            self.transitionTo('dashboard');
          }
          Ember.Logger.log('SUCCESS ' + session);
        }).catch(Ember.Logger.error);
      return;
    }
  }
});
