import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  password: '',
  isPasswordError: false,
  passwordConfirm: '',
  isPasswordConfirmError: false,
  actions: {
    confirmnewpassword: function() {
      var self = this;
      console.log('!!!!!!!!!confirmnewpassword');
      var password = self.get('signupPassword');
      console.log('!!!!!!!!!password:'+password);
      var isPasswordValid = password.length > 7;
      self.set('isPasswordError', !isPasswordValid);
      var isPasswordSame = password === self.get('signupPasswordConfirm');
      console.log('!!!!!!!!!isPasswordSame:'+isPasswordSame);
      self.set('isPasswordConfirmError', !isPasswordSame);
      console.log('!!!!!!!!!isPasswordValid:'+isPasswordValid);
      if (isPasswordValid && isPasswordSame) {
        var wl = window.location.toString();
        var code = wl.slice(wl.search(/code=/) + 5);
        console.log('!!!code:'+code);
        var requestData = {'resetpass':{
          resetpasswordcode: code,
          password: password
        }};
        var url = ENV.APP.RESET_PASSWORD_HOST+'confirmnewpassword';
        var result = Ember.$.ajax({
          url: url,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(requestData),
          crossDomain: true
        });
        result.done(function(response) {
          Ember.Logger.log(response);
        });
        result.fail(function(error) {
          Ember.Logger.log(error);
          Ember.$('#password').popover({
            title: 'error.',
            content: 'Error.',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#password').popover('show');
          setTimeout(function(){
            Ember.$('#password').popover('hide');
          }, 5000);
        });
      }
    }
  }
});
