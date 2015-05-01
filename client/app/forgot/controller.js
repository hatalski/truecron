import Ember from 'ember';
import ENV from 'true-cron/config/environment';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  isSuccess:      false,
  isResultFalse:  false,
  isWaiting:      false,
    actions: {
      sendRecoveryCode: function() {
        var self = this;
        var email = self.get('email');
        var isEmailValid = validator.isEmail(email);
        var requestData = {'resetpass':{}};
        requestData.env = ENV.APP.SERVER_HOST;
        this.set('isEmailError', !isEmailValid);
        if (isEmailValid) {
          requestData.resetpass = {email: email};
        }
        self.set('isWaiting',true);
        self.set('isResultFalse',false);
        var result = Ember.$.ajax({
          url: ENV.APP.RESET_PASSWORD_HOST,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(requestData),
          crossDomain: true
        });
        result.done(function(response) {
          self.set('isWaiting', false);
          console.log(response.message);
          Ember.$('#inputformrecovery').hide();
          self.set('isSuccess',true);
        });
        result.fail(function(error) {
          self.set('isWaiting', false);
          self.set('isResultFalse', true);
          console.log(error);
        });
      }
    }
});
