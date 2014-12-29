import {
  moduleFor,
  test
} from 'ember-qunit';

moduleFor('controller:dashboard/organization/workspace/jobs', 'DashboardOrganizationWorkspaceJobsController', {
  // Specify the other units that are required for this test.
  needs: [ 'controller:dashboard', 'controller:dashboard/organization', 'controller:dashboard/organization/workspace' ]
});

// Replace this with your real tests.
test('it exists', function() {
  var controller = this.subject();
  ok(controller);
});
