import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  isCodeUnCorrect: true,
  code:'',
  actions: {
    checkcode: function(){
      var wl = window.location.toString();
      var code;
      if (wl.search(/code=/) > 4){
        code = wl.slice(wl.search(/code=/) + 5);
      }
      console.log('!!!code:'+code);
      console.log('code.length: '+code.length);
      if (code.length < 41 & code.length > 1){
        this.set('checkCodeField', code);
        this.set('code', code);
      }
    },
    confirmreset: function(){
      var code = this.get('checkCodeField');
      var requestData = {'resetpass': {
        resetpasswordcode: code
      }};
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
        console.log(response);
        window.location = ENV.APP.SERVER_HOST+"/#/reset?code="+response.resetpass.resetpasswordcode;
      });
      result.error(function (error) {
        console.log(error);
        Ember.$('#inputCode').popover({
          title: 'result.error',
          content: 'Please check your code and try again.',
          placement: 'bottom',
          trigger: 'manual'
        });
        Ember.$('#inputCode').popover('show');
        setTimeout(function(){
          Ember.$('#inputCode').popover('hide');
        }, 7000);
      });
    }
  }
});
