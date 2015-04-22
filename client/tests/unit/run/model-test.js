import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('run', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:email',
    'model:organization',
    'model:workspace',
    'model:job',
    'model:history',
    'model:task',
    'model:organizations.organization.connection'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
