import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  email: '',
  isEmailError: false,
  password: '',
  isPasswordError: false,
  passwordConfirm: '',
  isPasswordConfirmError: false,
  hideSignUpButton: ENV.APP.HIDE_SIGNUP,
  actions: {
    signup: function() {
      var self = this;
      var email = this.get('email');
      var password = this.get('password');
      var isEmailValid = validator.isEmail(email);
      this.set('isEmailError', !isEmailValid);
      var isPasswordValid = password.length > 7;
      this.set('isPasswordError', !isPasswordValid);
      var isPasswordSame = password === this.get('passwordConfirm');
      this.set('isPasswordConfirmError', !isPasswordSame);
      if (isEmailValid && isPasswordValid && isPasswordSame) {
        var requestData = { email: email, password: password };
        var result = Ember.$.ajax({
          url: ENV.APP.SIGNUP_HOST,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(requestData),
          crossDomain: true
        });
        result.done(function(response) {
          Ember.Logger.log(response);
          var options = { identification: email, password: password };
          self.get('session').authenticate('authenticator:truecron', options);
        });
        result.fail(function(error) {
          Ember.Logger.log(error);
          Ember.$('#signupEmail').popover({
            title: 'Email address is taken.',
            content: 'The email address is already taken. Please choose another one.',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#signupEmail').popover('show');
          setTimeout(function(){
            Ember.$('#signupEmail').popover('hide');
          }, 5000);
        });
      }
    }
  }
});
