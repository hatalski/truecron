import Ember from 'ember';

export default Ember.Mixin.create({
  //textStatement: '',
  recurrenceRuleToText: function(rrule) {
    "use strict";
    return rrule;
  }
});
