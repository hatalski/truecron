import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:jobs/job', {
  // Specify the other units that are required for this test.
  needs: ['controller:jobs', 'service:websocket']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  var controller = this.subject();
  assert.ok(controller);
});
