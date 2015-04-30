/* global swal */

import Ember from 'ember';

export default Ember.Component.extend({
    tagName: 'a',
    classNames: ['btn', 'btn-signup', 'btn-material-orange-800'],
    click: function() {
        "use strict";
        var self = this;
        swal({
            title: self.get('alertTitle'),
            text: self.get('alertText'),
            type: "input",
            showCancelButton: true,
            animation: "slide-from-top",
            inputPlaceholder: "Please type name here",
            closeOnConfirm: false
        }, function(inputValue) {
            if (inputValue === false) {
                return false;
            }
            if (inputValue === "") {
                swal.showInputError("This field is required.");
                return false;
            }
            if(self.get('parent')) {
                self.sendAction('action', inputValue, self.get('parent'));
            } else {
                self.sendAction('action', inputValue);
            }
        });
    }
});
