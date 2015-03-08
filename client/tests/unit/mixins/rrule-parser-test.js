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

test('parsing hourly rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO');
  equal(text1, 'every 4 hours starting on 5 March 2015 at 21:00:00 GMT');
  var text2 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'every hour starting on 5 March 2015 at 21:00:00 GMT');
  var text3 = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;WKST=MO');
  equal(text3, 'every hour starting on 5 March 2015 at 21:00:00 GMT');
});

test('parsing minutely rrule interval', function() {
  "use strict";
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();

  var text1 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150201T220500Z;INTERVAL=50;WKST=MO');
  equal(text1, 'every 50 minutes starting on 1st February 2015 at 22:05:00 GMT');
  var text2 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150305T210000Z;INTERVAL=1;WKST=MO');
  equal(text2, 'every minute starting on 5 March 2015 at 21:00:00 GMT');
  var text3 = subject.recurrenceRuleToText('FREQ=MINUTELY;DTSTART=20150305T210000Z;WKST=MO');
  equal(text3, 'every minute starting on 5 March 2015 at 21:00:00 GMT');
});
