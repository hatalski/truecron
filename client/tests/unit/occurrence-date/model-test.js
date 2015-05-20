import occurrenceDate from '../../../occurrence-date/model';

import {
  module,
  test
  } from 'qunit';

module('occurrence-date', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = occurrenceDate.create({ occDateText: '2015-05-05T16:59:26.210Z'});
  // var store = this.store();
  assert.ok(!!model);
});
