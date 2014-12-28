import Ember from 'ember';
import Torii from 'simple-auth-torii/authenticators/torii';

export default Torii.extend({
  /**
    Authenticates the session by opening the torii provider. For more
    documentation on torii, see the
    [project's README](https://github.com/Vestorly/torii#readme).
    @method authenticate
    @param {String} provider The provider to authenticate the session with
    @param {Object} options The options to pass to the torii provider
    @return {Ember.RSVP.Promise} A promise that resolves when the provider successfully authenticates a user and rejects otherwise
  */
  authenticate: function(provider, options) {
    var _this = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      _this.torii.open(provider, options || {}).then(function(data) {
        _this.resolveWith(provider, data, resolve);
      }, reject);
    });
  },

  /**
    @method resolveWith
    @private
  */
  resolveWith: function(provider, data, resolve) {
    data.provider = provider;
    this.provider = data.provider;
    resolve(data);
  }

});