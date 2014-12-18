import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
// curl -u "-2:Igd7en1_VCMP59pBpmEF" -H "Content-Type:application/x-www-form-urlencoded" --data "grant_type=http://google.com&username=system@truecron.com" http://dev.truecron.com:3000/oauth/token

export default Ember.Controller.extend(LoginControllerMixin, {
    //authenticator: 'simple-auth-authenticator:oauth2-password-grant',
	authenticator: 'authenticator:truecron',
	invitationEmail: '',
	signupEmail: '',
	isEmailError: false, 	
	isInvitationEmailError: false,	
	signupPassword: '',
	isPasswordError: false,
	signupPasswordConfirm: '',
	isPasswordConfirmError: false,	
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
	  		} else {
	  			Ember.$('#invite_modal').modal({});
	  			var result = Ember.$.ajax('http://dev.truecron.com:3000/beta/signup', { type: 'POST'});
	  			result.success(function(data) {
	  				console.log(data);
	  			});
	  			result.error(function(error) { console.log(error); });
	  		}
	  	},
	  	signupModal: function() {
        	Ember.$('#signup_modal').modal({});
	  	},
	  	signup: function() {
	  		var self = this;
	  		var email = this.get('signupEmail');
	  		var password = this.get('signupPassword');

	  		var isEmailValid = validator.isEmail(email);
	  		this.set('isEmailError', !isEmailValid);
	  		//console.log(email + ' - isValid: ' + isEmailValid);

	  		var isPasswordValid = password.length > 7;
	  		this.set('isPasswordError', !isPasswordValid);

	  		var isPasswordSame = password === this.get('signupPasswordConfirm');
	  		this.set('isPasswordConfirmError', !isPasswordSame);

	  		if (isEmailValid && isPasswordValid && isPasswordSame) {

	  			var requestData = {
	  				email: email,
	  				password: password
	  			};

	  			// TODO: replace with superagent
	  			var result = Ember.$.ajax('http://dev.truecron.com:3000/auth/signup', 
	  				{
	  					type: 'POST',
	  					contentType: 'application/json',
	  					dataType: 'json',
	  					data: JSON.stringify(requestData),
	  					crossDomain: true
	  				});
	  			result.success(function(response) {
	  				console.log(response);
					var options = { identification: email, password: password };
					self.get('session').authenticate('authenticator:truecron', options);
	  			});
	  			result.error(function(error) { console.log(error); });
	  			console.log('All good!');
	  		}
	  	}	  	
    }
});