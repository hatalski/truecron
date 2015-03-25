import Ember from 'ember';
import ENV from 'true-cron/config/environment';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  isSuccess: false,
    actions: {
      sendRecoveryCode: function() {
        var self = this;
        var email = self.get('signupEmail');
        console.log('email for reset:'+email);
        var isEmailValid = validator.isEmail(email);
        var requestData = {'resetpass':{ }};
        requestData.env = ENV.APP.SERVER_HOST;
        console.log('ENV.APP.SERVER_HOST:'+ENV.APP.SERVER_HOST);
        this.set('isEmailError', !isEmailValid);

        if (isEmailValid) {
          requestData.resetpass = {email: email};
        }
        console.log(ENV.APP.RESET_PASSWORD_HOST);
        var result = Ember.$.ajax({
          url: ENV.APP.RESET_PASSWORD_HOST,
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          data: JSON.stringify(requestData),
          crossDomain: true
        });
        result.success(function(response) {
          console.log(response.message);
          Ember.$('#inputformrecovery').hide();
          self.set('isSuccess',true);
        });
        result.error(function(error) {
          console.log(error);
          Ember.$('#email').popover({
            title: 'result.error',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#email').popover('show');
          setTimeout(function(){
            Ember.$('#email').popover('hide');
          }, 7000);
        });
      }
    }
});
