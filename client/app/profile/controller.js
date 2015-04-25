import Ember from 'ember';

export default Ember.Controller.extend({
    isNotEditName: true,
    isEditNAme: false,
    isNotEditPassword: true,
    isEditPassword: false,
    oldName: "",
    actions: {
        editNameAndEmail: function(){
            this.set('oldName', this.get('userName'));
            this.set('isNotEditName', false);
            this.set('isEditNAme', true);
        },
        saveNameAndEmail: function(){
            this.set('isNotEditName', true);
            this.set('isEditNAme', false);
        },
        cancelNameAndEmail: function(){
            this.set('userName', this.get('oldName'));
        },
        editPassword: function(){
            this.set('isNotEditPassword', false);
            this.set('isEditPassword', true);
        },
        cancelEditPassword: function(){

        },
        savePassword: function(){

        }
    }
});
