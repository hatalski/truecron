import Ember from 'ember';

// app/controllers/login.js
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

// curl -u "-2:Igd7en1_VCMP59pBpmEF" -H "Content-Type:application/x-www-form-urlencoded" --data "grant_type=http://google.com&username=system@truecron.com" http://dev.truecron.com:3000/oauth/token

export default Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'authenticator:truecron'
  //authenticator: 'simple-auth-authenticator:oauth2-password-grant'
});