/* global swal */

import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        clicked: function() {
            "use strict";
            var self = this;
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this job!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, remove it!",
                closeOnConfirm: false
            }, function(isConfirm) {
                if (isConfirm) {
                    self.sendAction('action', swal("Removed!", "Your job has been successfuly removed.", "success"));
                } else {
                    swal("Cancelled", "Your job is safe :)", "error");
                }
            });
        }
    }
});