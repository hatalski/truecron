import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  isNotEditName: true,
  isEditNAme: false,
  isNotEditPassword: true,
  isEditPassword: false,
  oldName: "",
  oldPassword: "",
    actions:
    {
      editNameAndEmail: function(){
        var self = this;
        self.set('oldName', self.get('model.name'));
        this.set('isNotEditName', false);
        this.set('isEditNAme', true);
        },
        saveNameAndEmail: function(){
          var self = this;
          var requestData = {'profile':{}};
          var emails = self.get('model.emails');
          var email;
          for (var i = 0; i < emails.length; i++) {
            email = emails[0];
          }
          var test = self.get('#test');
          console.log('!!!!!email: ' + email);
          console.log('!!!!!test: ' + test);
          console.log('!!!!!emails: ' + emails);
          console.log('!!!!!userEmail.email: ' + self.get('model.email'));
          this.set('model.name', this.get('model.name'));
          this.set('isNotEditName', true);
          this.set('isEditNAme', false);
          requestData.profile = {
            email: this.get('userEmail.email'),
            name: this.get('model.name')
          };
//send to db new name
          var result = Ember.$.ajax({
            url: ENV.APP.UPDATE_USER_NAME_HOST,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(requestData),
            crossDomain: true
          });
          result.done(function(response) {

            console.log(response.message);
          });
          result.fail(function(error) {
            console.log(error);
          });


        },
        cancelNameAndEmail: function(){
          this.set('model.name', this.get('oldName'));
          this.set('isNotEditName', true);
          this.set('isEditNAme', false);
        },
        editPassword: function(){
          var self = this;
          self.set('oldPassword', self.get('model.password'));
          this.set('isNotEditPassword', false);
          this.set('isEditPassword', true);
        },
        cancelEditPassword: function(){
          this.set('model.password', this.get('oldPassword'));
          this.set('passwordConfirm','');
          this.set('isNotEditPassword', true);
          this.set('isEditPassword', false);
        },
        savePassword: function(){
          var password = this.get('model.password');
          var isPasswordValid = password.length > 7;
          var isPasswordSame = password === this.get('passwordConfirm');
          if (isPasswordValid && isPasswordSame) {
            this.set('model.password', this.get('model.password'));
            this.set('isNotEditPassword', true);
            this.set('isEditPassword', false);
          }
          else{
            Ember.$('#inputConfirmPassword').popover({
              title: 'error.',
              content: 'Password Confirmation and the password is not identical.',
              placement: 'bottom',
              trigger: 'manual'
            });
            Ember.$('#inputConfirmPassword').popover('show');
            setTimeout(function(){
              Ember.$('#inputConfirmPassword').popover('hide');
            }, 5000);
          }
        }
    }
});
