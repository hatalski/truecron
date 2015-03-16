import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  email: '',
  actions: {
    confirmreset: function(){
      var wl = window.location.toString();
      //find email in params
      var startEmail = 0;
      var endEmail;
      var email = '';
      var code = '';
      startEmail = wl.indexOf('mail=');
      endEmail = wl.indexOf('&');
        if (startEmail & endEmail) {
          for (var i = startEmail + 5; i < endEmail; i++) {
            email += wl[i];
          }
          code = wl.slice(wl.search(/code=/) + 5);
        }
        console.log('!!!code:'+code);
        console.log('!!!email:'+email);
            //console.log('I am here!!!');
            var requestData = {'resetpass': {
              email: email,
              resetpasswordcode: code
            }};
            //requestData.resetpass = {email: email, resetpasswordcode: code};
            var urlfordbconfirmreset = ENV.APP.RESET_PASSWORD_HOST + 'confirmreset';
            console.log(urlfordbconfirmreset);
            var result = Ember.$.ajax({
              url: urlfordbconfirmreset,
              type: 'POST',
              contentType: 'application/json',
              dataType: 'json',
              data: JSON.stringify(requestData),
              crossDomain: true
            });
            result.success(function (response) {
              console.log(response.message);
            });
            result.error(function (error) {
              console.log(error);
            });


    }

  }
});
