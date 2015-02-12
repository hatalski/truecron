import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('organizations/organization/plan', 'OrganizationsOrganizationPlan', {
  // Specify the other units that are required for this test.
  needs: []
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
