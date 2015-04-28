import Ember from 'ember';

export default Ember.Controller.extend({
  isNotEditName: true,
  isEditNAme: false,
  isNotEditPassword: true,
  isEditPassword: false,
  oldName:"",
  oldPassword: "",
    actions:
    {
      editNameAndEmail: function(){
        var self = this;
        self.set('isNotEditName', false);
        self.set('isEditNAme', true);
        },
        saveNameAndEmail: function(){
          var self = this;
          self.get('model').save()
            .then(function(savedUser){
              self.set('isNotEditName', true);
              self.set('isEditNAme', false);
            console.log('Saved User: ', savedUser);
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
          var self = this;
          var password = this.get('model.password');
          var isPasswordValid = password.length > 7;
          var isPasswordSame = password === this.get('passwordConfirm');
          if (isPasswordValid && isPasswordSame) {
            self.get('model').save()
              .then(function(savedPassword){
                self.set('isNotEditPassword', true);
                self.set('isEditPassword', false);
              });
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
