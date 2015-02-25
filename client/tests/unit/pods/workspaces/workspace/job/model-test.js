import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspaces/workspace/job', 'WorkspacesWorkspaceJob', {
  // Specify the other units that are required for this test.
  needs: ['model:user',
    'model:workspace',
    'model:job-tag',
    'model:organizations.organization.connection',
    'model:workspaces.workspace.jobs.job.task',
    'model:organization',
    'model:workspaces.workspace.job']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
