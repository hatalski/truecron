import Ember from 'ember';

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
      if(startEmail & endEmail) {
        for (var i = startEmail + 5; i < endEmail; i++) {
          email += wl[i];
        }
        code = wl.slice(wl.search(/code=/) + 5);
      }
      console.log('!!!code:'+code);
      console.log('!!!email:'+email);

    }
  }
});
