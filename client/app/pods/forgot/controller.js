import Ember from 'ember';
import ENV from 'true-cron/config/environment';
//import Crypto from 'true-cron/node_modules/ember-cli/node_modules/npm/node_modules/request/node_modules/hawk/lib';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend(LoginControllerMixin, {
  email:'',
  isSuccess: false,
    actions: {
      sendRecoveryCode: function() {
        var self = this;
        var email = self.get('signupEmail');
        console.log('email for reset:'+email);
        //var crypto = Crypto;
        //try {
        //  var buf = crypto.randomBytes(16);
        //  console.log('Have %d bytes of random data: %s', buf.length, buf);
        //} catch (ex) {
        //  console.log(ex);
        //}
        var resetPasswordCode = 'Zd64L4ORUc5h7MoPvAOTOfBgnq8Mg'; // this is just an example, we should do real resetPasswordCode
        var isEmailValid = validator.isEmail(email);
        var requestData = {'resetpass':{}};
        this.set('isEmailError', !isEmailValid);

        if (isEmailValid) {
          requestData.resetpass = {email: email, resetpasswordcode: resetPasswordCode};
        }
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
          Ember.$('#email').popover({
            title: 'Verification code has been sent.',
            content: 'Check your email!',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#email').popover('show');
          setTimeout(function(){
            Ember.$('#email').popover('hide');
          }, 7000);
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
          console.log(error);
        });
      }
    }
});
