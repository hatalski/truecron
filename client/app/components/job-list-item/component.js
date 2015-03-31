import Ember from 'ember';
import RRuleParser from 'true-cron/mixins/rrule-parser';

export default Ember.Component.extend(RRuleParser, {
  tagName: 'span',
  //classNames: ['list-group-item'],
  // attributeBindings: ['href'],
  // href: '#',
  //selectedRepeatRule: 'Daily',
  //repeatRules: ['Minutely', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
  //selectedRepeatEvery: 1,
  //repeatEvery: function() {
  //  // console.log('repeatEvery called');
  //  switch (this.get('selectedRepeatRule')) {
  //    case 'Minutely':
  //      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
  //    case 'Hourly':
  //      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
  //    default:
  //      return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  //  }
  //}.property('selectedRepeatRule'),
  // lastRunError: null,
  // running: false,
  jobStateColorClass: function() {
    "use strict";
    switch (this.get('job.status')) {
      case 'never':
        return 'neverrun-job';
      case 'failed':
        return 'failed-job';
      case 'success':
        return 'success-job';
      case 'running':
        return 'running-job';
    }
  }.property(),
  jobStateIconClass: function() {
    "use strict";
    switch (this.get('job.status')) {
      case 'running':
        return 'fa-spinner fa-pulse';
      default:
        return 'fa-square';
    }
  }.property(),
  recurrence: function() {
    var o = RRule.parseString(this.get('job.rrule'));
    var startsAt = this.get('job.startsAt');
    // console.log('startsAt : ' + startsAt);
    if (startsAt === undefined) {
      startsAt = new Date();
    }
    // console.log('startsAt date : ' + new Date(startsAt));
    o.dtstart = new Date(startsAt);
    //var rule = new RRule(o);
    //var now = new Date();
    return {
      text:    this.recurrenceRuleToText(this.get('job.rrule')),
      lastRun: new Date(),//'todo'rule.before(now, true),
      nextRun: new Date()//'todo'//rule.after(now, true)
    };
  }.property('job.rrule', 'job.startsAt'),
  actions: {
    click: function() {
      "use strict";
      Ember.Logger.log('component clicked');
      this.sendAction('action', this.get('job'));
      //if (this.get('linkTo')) {
      //  this.transitionToRoute(this.get('linkTo'));
      //} else {
      //  Ember.Logger.log('linkTo parameter is NOT specified in job-list-item component.');
      //  return;
      //}
    }
  }
});
