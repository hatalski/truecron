import Ember from 'ember';
import ENV from 'true-cron/config/environment';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    googleLogin: function() {
      Ember.Logger.log('google login initiated');
      var self = this;
      self.get('session').authenticate('simple-auth-authenticator:torii', 'google-token')
        .then(function() {
          var session = self.get('session');
          if (session.get('authenticator') === 'authenticator:truecron') {
            self.transitionTo('workspaces');
          }
          Ember.Logger.log('SUCCESS ' + session);
        }).catch(Ember.Logger.error);
      return;
    },
    authenticateSession: function() {
      Ember.Logger.log('authenticateSession called');
      this._super();
    },
    sessionAuthenticationFailed: function(error) {
      Ember.Logger.log(error);
      Ember.Logger.log('sessionAuthenticationFailed called');
      // invalid_grant error returned from server when credentials are incorrect
      if (error.error === 'invalid_grant') {
        Ember.Logger.log('authenticator: authenticator:truecron');
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
      }
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
        Ember.Logger.log('serverSignUpEndpoint : ' + ENV.APP.SIGNUP_HOST);
        var result = Ember.$.ajax(ENV.APP.SIGNUP_HOST, {
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(requestData),
          crossDomain: true
        });
        result.done(function(response) {
          Ember.Logger.log('sign up success');
          Ember.Logger.log(response);
          var options = { identification: session.get('userEmail'), grant_type: 'http://google.com' };
          self.get('session').authenticate('authenticator:truecron', options)
            .then(function(result) {
              Ember.Logger.log('on authenticate result');
              Ember.Logger.log(result);
              self.transitionTo('workspaces');
            }).catch(Ember.Logger.error);
        });
        result.fail(function(error) {
          Ember.Logger.log('sign up error');
          Ember.Logger.log(error);
          var options = { identification: session.get('userEmail'), grant_type: 'http://google.com' };
          self.get('session').authenticate('authenticator:truecron', options)
            .then(function(result) {
              Ember.Logger.log('on authenticate result');
              Ember.Logger.log(result);
              self.transitionTo('workspaces');
            }).catch(Ember.Logger.error);
          return { error: error };
        });
      } else {
        Ember.Logger.log('authenticator: authenticator:truecron');
        this._super();
      }
    }
  }
});
