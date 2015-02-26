import Ember from 'ember';
import ENV from 'true-cron/config/environment';
//import Crypto from 'true-cron/node_modules/ember-cli/node_modules/npm/node_modules/request/node_modules/hawk/lib';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
// curl -u "-2:Igd7en1_VCMP59pBpmEF" -H "Content-Type:application/x-www-form-urlencoded" --data "grant_type=http://google.com&username=system@truecron.com" http://dev.truecron.com:3000/oauth/token

export default Ember.Controller.extend(LoginControllerMixin, {
  email:'',
    actions: {
    	forgotpasswordModal: function() {
        Ember.$('#forgotpassword_modal').modal({});
      },
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
        var requestData;
        this.set('isEmailError', !isEmailValid);

        if (isEmailValid) {
          requestData = {email: email, resetpasswordcode: resetPasswordCode};
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
          Ember.$('#resetpasswordEmail').popover({
            title: 'Verification code has been sent.',
            content: 'Check your email!',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#resetpasswordEmail').popover('show');
          setTimeout(function(){
            Ember.$('#resetpasswordEmail').popover('hide');
          }, 7000);
        });
        result.error(function(error) {
          console.log(error);
          Ember.$('#resetpasswordEmail').popover({
            title: 'result.error',
            placement: 'bottom',
            trigger: 'manual'
          });
          Ember.$('#resetpasswordEmail').popover('show');
          setTimeout(function(){
            Ember.$('#resetpasswordEmail').popover('hide');
          }, 7000);
          console.log(error);
        });
      }
    }
});
