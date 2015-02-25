import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspaces/workspace/jobs/job/record', 'WorkspacesWorkspaceJobsJobRecord', {
  // Specify the other units that are required for this test.
  needs: ['model:user',
    'model:workspace',
    'model:job-tag',
    'model:workspaces.workspace.jobs.job.task',
    'model:workspaces.workspace.job']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
