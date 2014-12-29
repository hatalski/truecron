import Ember from 'ember';
import {configurable} from 'torii/configuration';
import Oauth2Bearer from 'torii/providers/oauth2-bearer';

var GoogleToken = Oauth2Bearer.extend({
	name: 'google-token',
	baseUrl: 'https://accounts.google.com/o/oauth2/auth',
  // additional params that this provider requires
  requiredUrlParams: ['state'],
  optionalUrlParams: ['scope', 'request_visible_actions', 'access_type'],
  requestVisibleActions: configurable('requestVisibleActions', ''),
  accessType: configurable('accessType', ''),
  responseParams: ['token'],
  scope: configurable('scope', 'email'),
  state: configurable('state', 'STATE'),
  redirectUri: configurable('redirectUri',
                            'http://localhost:4200'),
  serverSignUpEndpoint: configurable('serverSignUpEndpoint', 
                                     'http://dev.truecron.com:3000/auth/signup'),

  open: function(options) {
      // var self = this;
      Ember.Logger.log('google-token provider open method entered with options: ');
      Ember.Logger.log(options);
      var name        = this.get('name'),
          url         = this.buildUrl(),
          redirectUri = this.get('redirectUri'),
          responseParams = this.get('responseParams'),
          signupEndpoint = this.get('serverSignUpEndpoint');

      var client_id = this.get('client_id');
      Ember.Logger.log('client_id is: ' + client_id);

      return this.get('popup').open(url, responseParams).then(function(authData) {
        Ember.Logger.log('on popup auth data triggered with authData: ');
        Ember.Logger.log(authData);

        var missingResponseParams = [];

        responseParams.forEach(function(param){
          if (authData[param] === undefined) {
            missingResponseParams.push(param);
          }
        });

        if (missingResponseParams.length){
          throw "The response from the provider is missing " +
                "these required response params: " + responseParams.join(', ');
        }

        return Ember.$.get("https://www.googleapis.com/plus/v1/people/me", {
            access_token: authData.token
          }).then(function(user) {
            Ember.Logger.log('retrieved user profile from Google:');
            Ember.Logger.log(user);
            if (user) {
              var email = user.emails[0].value;
              user.provider = 'google';
              var requestData = {
                email: email, 
                name: user.displayName, 
                extensionData: user
              };

              var result = Ember.$.ajax(signupEndpoint, {
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(requestData),
                crossDomain: true
              });
              result.success(function(response) {
                Ember.Logger.log('sign up success');
                Ember.Logger.log(response);
                return {
                  userName: user.displayName,
                  userEmail: user.emails[0].value,
                  profile: user,
                  provider: name,
                  redirectUri: redirectUri
                };
              });
              result.error(function(error) {
                Ember.Logger.log('sign up error');
                Ember.Logger.log(error);
                return { error: error };
              });
            }
        });
      });
    }
});

export default GoogleToken;