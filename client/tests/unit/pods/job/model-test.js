import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:workspace',
    'model:organization',
    'model:workspaces.workspace.job',
    'model:organizations.organization.connection',
    'model:job-tag',
    'model:workspaces.workspace.jobs.job.task']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
