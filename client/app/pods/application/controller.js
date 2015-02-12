import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  hideSignUpButton: ENV.APP.HIDE_SIGNUP,
  actions: {
    redirectToSignup: function() {
      this.transitionToRoute('signup');
    },
    redirectToSignin: function() {
      this.transitionToRoute('signin');
    }
  }
});
