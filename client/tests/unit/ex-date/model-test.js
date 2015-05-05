import Ember from 'ember';
import exDate from '../../../ex-date/model';

import {
  module,
  test
} from 'qunit';

module('ex-date', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var subject = exDate.create();
  // var store = this.store();
  assert.ok(!!subject);
});


test('if toDate is null then return emptyDateValue', function() {
  var subject = exDate.create();
  var model = subject;
  model.set('toDate', null);
  var toDateText = model.get('toDateText');
  equal(toDateText, model.get('emptyDateValue'));
});
