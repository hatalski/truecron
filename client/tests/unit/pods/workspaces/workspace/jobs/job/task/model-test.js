import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspaces/workspace/jobs/job/task', 'WorkspacesWorkspaceJobsJobTask', {
  // Specify the other units that are required for this test.
  needs: ['model:workspaces.workspace.job',
    'model:user',
    'model:workspace',
    'model:job-tag']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
