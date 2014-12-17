import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
// curl -u "-2:Igd7en1_VCMP59pBpmEF" -H "Content-Type:application/x-www-form-urlencoded" --data "grant_type=http://google.com&username=system@truecron.com" http://dev.truecron.com:3000/oauth/token

export default Ember.Controller.extend(LoginControllerMixin, {
	authenticator: 'authenticator:truecron',
	invitationEmail: '',
	globalsignupemail: '',
	isGlobalEmailError: false, 	
	isInvitationEmailError: false,	
	globalpassword: '',
	isGlobalPassError: false,
	globalpasswordconfirm: '',
	isGlobalPassConfirmError: false,	
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
	  	globalsignup: function() {	 
	  		var flagEmail = false;
	  		var flagPass = false;
	  		var flagConfPass = false; 		
	  		var globalEmail = this.get('globalsignupemail');
	  		if (!validator.isEmail(globalEmail)) {	  			
	  			this.set('isGlobalEmailError', true);
	  			console.log(globalEmail+'-not valid email');
	  			flagEmail = false;	  			
	  		} else {
	  			this.set('isGlobalEmailError', false);
	  			console.log(globalEmail+'-valid email');
	  			flagEmail = true;
	  		}
	  		
	  		var globalPass = this.get('globalpassword');
	  		if (globalPass.length < 8) {
	  			this.set('isGlobalPassError', true);
	  			this.set('globalpassword', null);
	  			flagPass = false;
	  		}
	  		else {
	  			this.set('isGlobalPassError', false);
	  			flagPass = true;	  			
	  		}

	  		if (this.get('globalpassword')===this.get('globalpasswordconfirm')) {
	  			this.set('isGlobalPassConfirmError', false);
	  			console.log('Password confirmed!');	 
	  			flagConfPass = true;	
	  		}
	  		else {
	  			console.log('the password is not confirmed');
	  			this.set('isGlobalPassConfirmError', true);
	  			this.set('globalpasswordconfirm', null);
	  			flagConfPass = false;
	  		}	  		
	  		
	  		if (flagEmail && flagPass && flagConfPass) {
	  			//something to do
	  			/*var result = Ember.$.ajax('http://dev.truecron.com:3000/beta/signup', { type: 'POST'});
	  			result.success(function(data) {
	  				console.log(data);
	  			});
	  			result.error(function(error) { console.log(error); });
	  			*/
	  			console.log('All good!');
	  		}

	  	}	  	
    }
});