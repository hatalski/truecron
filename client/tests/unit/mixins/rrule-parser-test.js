import Ember from 'ember';
import RruleParserMixin from '../../../mixins/rrule-parser';
import { module, test } from 'qunit';

module('RruleParserMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var RruleParserObject = Ember.Object.extend(RruleParserMixin);
  var subject = RruleParserObject.create();
  assert.ok(subject);
  debugger;
  var text = subject.recurrenceRuleToText('FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO');
  assert.same(text, 'Every 4 hours starting on 5 march 2015 at 21:00:00 GMT');
});
