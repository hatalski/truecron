import Ember from 'ember';
import schedule from '../../../schedule/model';

import {
  module,
  test
  } from 'qunit';

module('schedule', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function(assert) {
  var model = schedule.create();
  // var store = this.store();
  assert.ok(!!model);
});
