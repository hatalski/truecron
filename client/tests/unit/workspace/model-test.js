import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspace', 'Workspace', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:email',
    'model:organization',
    'model:job-tag',
    'model:job',
    'model:task',
    'model:organizations.organization.connection']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
