import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
// curl -u "-2:Igd7en1_VCMP59pBpmEF" -H "Content-Type:application/x-www-form-urlencoded" --data "grant_type=http://google.com&username=system@truecron.com" http://dev.truecron.com:3000/oauth/token

export default Ember.Controller.extend(LoginControllerMixin, {
	authenticator: 'authenticator:truecron',
	invitationEmail: '',
	isInvitationEmailError: false,
	signUpNewEmail: '',
	isInviteEmailError: function() {
		return this.get('isInvitationEmailError');
	}.property('isInvitationEmailError'),
    //authenticator: 'simple-auth-authenticator:oauth2-password-grant',
    actions: {
	  	authenticate: function(options) {
	  		console.dir(options);
	  		this._super(options);
	  	},
	  	invite: function() {
	  		var inviteEmail = this.get('invitationEmail');
	  		if (!validator.isEmail(inviteEmail)) {
	  			console.log('email is empty');
	  			this.set('isInvitationEmailError', true);
	  			console.log(this.get('isInvitationEmailError'));
	  		} else {
	  			Ember.$('#invite_modal').modal({});
	  			var result = Ember.$.ajax('http://dev.truecron.com:3000/beta/signup', { type: 'POST'});
	  			result.success(function(data) {
	  				console.log(data);
	  			});
	  			result.error(function(error) { console.log(error); });
	  		}
	  	},
	  	signup: function() {
        Ember.$('#signup_modal').modal({});
	  	},
	  	signUpNew: function(){
	  		var signUpNewEmail = this.get('signUpNewEmail');
			console.log('this is mail');
	  		console.log(signUpNewEmail);	
	  		if (!validator.isEmail(signUpNewEmail)) {
	  			console.log('email is empty');	  			
	  		} else {
	  			Ember.$('#invite_modal').modal({});
	  			var result = Ember.$.ajax('http://dev.truecron.com:3000/beta/signup', { type: 'POST'});
	  			result.success(function(data) {
	  				console.log(data);
	  			});
	  			result.error(function(error) { console.log(error); });
	  		}  		
	  		console.log('this is test');
	  		console.log(signUpNewEmail);
	  	}
    }
});
