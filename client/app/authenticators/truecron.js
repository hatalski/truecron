import Ember from 'ember';
import OAuth2 from 'simple-auth-oauth2/authenticators/oauth2';

export default OAuth2.extend({
  /**
    Sends an `AJAX` request to the `url`. This will always be a _"POST"_
    request with content type _"application/x-www-form-urlencoded"_ as
    specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

    This method is not meant to be used directly but serves as an extension
    point to e.g. add _"Client Credentials"_ (see
    [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

    @method makeRequest
    @param {Object} url The url to send the request to
    @param {Object} data The data to send with the request, e.g. username and password or the refresh token
    @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
    @protected
  */
  makeRequest: function(url, data) {
    return Ember.$.ajax({
      url:         url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic LTI6SWdkN2VuMV9WQ01QNTlwQnBtRUY=');
      },
      type:        'POST',
      data:        data,
      dataType:    'json',
      contentType: 'application/x-www-form-urlencoded'
    });
  },
  authenticate: function(options) {
    Ember.Logger.log('we are inside authenticator authenticate method');
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var grant_type = options.grant_type || 'password';
      var data = { grant_type: grant_type, username: options.identification, password: options.password };
      if (!Ember.isEmpty(options.scope)) {
        var scopesString = Ember.makeArray(options.scope).join(' ');
        Ember.merge(data, { scope: scopesString });
      }
      _this.makeRequest(_this.serverTokenEndpoint, data).then(function(response) {
        Ember.Logger.log('authentication request is resolved');
        Ember.run(function() {
          var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
          _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
          if (!Ember.isEmpty(expiresAt)) {
            response = Ember.merge(response, { expires_at: expiresAt });
          }
          resolve(response);
        });
      }, function(xhr, status, error) {
        Ember.Logger.log('authentication request is rejected');
        Ember.Logger.log('status: ' + status);
        Ember.Logger.log('error: ' + error);
        Ember.run(function() {
          reject(xhr.responseJSON || xhr.responseText);
        });
      });
    });
  },
});
