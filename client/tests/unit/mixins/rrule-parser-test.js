import Ember from 'ember';
import RruleParserMixin from '../../../mixins/rrule-parser';
import { module, test } from 'qunit';

module('RruleParserMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();
  assert.ok(subject);
});

test('parsing yearly rrule interval with until date', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150309T200100Z;UNTIL=20171030T220000Z;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text1, 'Every 4 years on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00 until October 31st 2017 01:00:00 AM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150309T200100Z;UNTIL=20171030T220000Z;COUNT=30;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text2, 'Every 4 years on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00 until October 31st 2017 01:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150309T200100Z;COUNT=30;INTERVAL=1;WKST=MO');
  equal(text3, 'Every year starting on March 9th 2015 at 11:01:00 PM +03:00 for 30 times');
});

test('parsing yearly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150309T200100Z;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text1, 'Every 4 years on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150309T000000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every year starting on March 9th 2015 at 03:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20161221T110000Z;WKST=MO');
  equal(text3, 'Every year starting on December 21st 2016 at 02:00:00 PM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2,8');
  equal(text4, 'Every year in February and August on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text5 = subject.recurrenceRuleToText('FREQ=YEARLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2');
  equal(text5, 'Every year in February on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing monthly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=MONTHLY;DTSTART=20150309T200100Z;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text1, 'Every 4 months on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=MONTHLY;DTSTART=20150309T000000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every month starting on March 9th 2015 at 03:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=MONTHLY;DTSTART=20161221T110000Z;WKST=MO');
  equal(text3, 'Every month starting on December 21st 2016 at 02:00:00 PM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=MONTHLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2,8');
  equal(text4, 'Every month in February and August on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text5 = subject.recurrenceRuleToText('FREQ=MONTHLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2');
  equal(text5, 'Every month in February on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing weekly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=WEEKLY;DTSTART=20150309T200100Z;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text1, 'Every 4 weeks on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=WEEKLY;DTSTART=20150309T000000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every week starting on March 9th 2015 at 03:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=WEEKLY;DTSTART=20161221T110000Z;WKST=MO');
  equal(text3, 'Every week starting on December 21st 2016 at 02:00:00 PM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=WEEKLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2,8');
  equal(text4, 'Every week in February and August on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text5 = subject.recurrenceRuleToText('FREQ=WEEKLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2');
  equal(text5, 'Every week in February on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing daily rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=DAILY;DTSTART=20150309T200100Z;INTERVAL=4;WKST=MO;BYDAY=MO,TU,WE,TH,FR');
  equal(text1, 'Every 4 days on Monday, Tuesday, Wednesday, Thursday, Friday starting on March 9th 2015 at 11:01:00 PM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=DAILY;DTSTART=20150309T000000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every day starting on March 9th 2015 at 03:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=DAILY;DTSTART=20161221T110000Z;WKST=MO');
  equal(text3, 'Every day starting on December 21st 2016 at 02:00:00 PM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=DAILY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR;BYMONTH=2,8');
  equal(text4, 'Every day in February and August on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing hourly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO');
  equal(text1, 'Every 4 hours starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every hour starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;WKST=MO');
  equal(text3, 'Every hour starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=TU,TH,FR');
  equal(text4, 'Every hour on Tuesday, Thursday, Friday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing minutely rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150201T220500Z;INTERVAL=50;WKST=MO');
  equal(text1, 'Every 50 minutes starting on February 2nd 2015 at 01:05:00 AM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150305T210000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every minute starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150305T210000Z;WKST=MO');
  equal(text3, 'Every minute starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=MO,WE,SA,SU');
  equal(text4, 'Every minute on Monday, Wednesday, Saturday, Sunday starting on March 6th 2015 at 12:00:00 AM +03:00');
});

test('parsing secondly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=SECONDLY;DTSTART=20150201T220500Z;INTERVAL=50;WKST=MO');
  equal(text1, 'Every 50 seconds starting on February 2nd 2015 at 01:05:00 AM +03:00');
  var text2 = subject.recurrenceRuleToText('FREQ=SECONDLY;DTSTART=20150305T210000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'Every second starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text3 = subject.recurrenceRuleToText('FREQ=SECONDLY;DTSTART=20150305T210000Z;WKST=MO');
  equal(text3, 'Every second starting on March 6th 2015 at 12:00:00 AM +03:00');
  var text4 = subject.recurrenceRuleToText('FREQ=SECONDLY;DTSTART=20150305T210000Z;WKST=MO;BYDAY=MO,WE,SA,SU');
  equal(text4, 'Every second on Monday, Wednesday, Saturday, Sunday starting on March 6th 2015 at 12:00:00 AM +03:00');
});
