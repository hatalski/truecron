import Ember from 'ember';
import RRuleParser from 'true-cron/mixins/rrule-parser';

export default Ember.Component.extend(RRuleParser, {
  tagName: 'div',
  classNames: ['list-group-item', 'truecron-group-item'],
  classNameBindings: ['active:truecron-tab-active', 'active:truecron-active-border'],
  active: Ember.computed('selected',function() {
    "use strict";
    return this.get('selected.id') === this.get('job.id');
  }),
  click: function() {
    "use strict";
    this.sendAction('action', this.get('job'));
  },
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
    // TODO: replace with schedule.rrule
    var o = RRule.parseString('FREQ=WEEKLY;COUNT=30'); // this.get('job.rrule')
    var startsAt; // this.get('job.startsAt')
    // console.log('startsAt : ' + startsAt);
    if (startsAt === undefined) {
      startsAt = new Date();
    }
    // console.log('startsAt date : ' + new Date(startsAt));
    o.dtstart = new Date(startsAt);
    //var rule = new RRule(o);
    //var now = new Date();
    return {
      text:    this.recurrenceRuleToText('FREQ=WEEKLY;COUNT=30'), // this.get('job.rrule')
      lastRun: new Date(),//'todo'rule.before(now, true),
      nextRun: new Date()//'todo'//rule.after(now, true)
    }.property();
  }
});
