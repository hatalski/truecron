import Ember from 'ember';

export default Ember.Mixin.create({
  //textStatement: '',
  recurrenceRuleToText: function(rrule) {
    "use strict";
    var rules = rrule.split(';');
    Ember.$.each(rules, function(index, rule) {
      var options = rule.split('=');
      var ruleName = options[0];
      var ruleValue = options[1];
      switch(ruleName) {
        case 'FREQ':
          switch(ruleValue) {
            case 'SECONDLY':
              break;
            case 'MINUTELY':
              break;
            case 'HOURLY':
              break;
            case 'DAILY':
              break;
            case 'WEEKLY':
              break;
            case 'MONTHLY':
              break;
            case 'YEARLY':
              break;
          }
          break;
        case 'DTSTART':
          break;
        case 'UNTIL':
          break;
        case 'COUNT':
          break;
        case 'INTERVAL':
          break;
        case 'WKST':
          break;
        case 'BYDAY':
          break;
        case 'BYMONTH':
          break;
        case 'BYSETPOS':
          break;
        case 'BYMONTHDAY':
          break;
        case 'BYYEARDAY':
          break;
        case 'BYWEEKNO':
          break;
        case 'BYHOUR':
          break;
        case 'BYMINUTE':
          break;
        case 'BYSECOND':
          break;
        case 'BYEASTER':
          break;
      }
    });
    return rrule;
  }
});
