import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('history', {
  // Specify the other units that are required for this test.
  needs: [
    'model:organization',
    'model:workspace',
    'model:job',
    'model:run',
    'model:task',
    'model:user',
    'model:email',
    'model:organizations.organization.connection'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
