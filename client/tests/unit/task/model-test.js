import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('task', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:job',
    'model:job-tag',
    'model:workspace'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
