import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('route:jobs/job', {
  // Specify the other units that are required for this test.
  needs: ['service:websocket']
});

test('it exists', function(assert) {
  var route = this.subject();
  assert.ok(route);
});
