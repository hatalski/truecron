import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspaces/workspace/jobs/job/run', 'WorkspacesWorkspaceJobsJobRun', {
  // Specify the other units that are required for this test.
  needs: ['model:outputMessage']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
