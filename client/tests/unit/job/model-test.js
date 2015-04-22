import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:email',
    'model:workspace',
    'model:organization',
    'model:organizations.organization.connection',
    'model:job',
    'model:job-tag',
    'model:task']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
