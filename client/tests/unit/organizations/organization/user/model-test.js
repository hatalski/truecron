import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('organizations/organization/user', 'OrganizationsOrganizationUser', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
    'model:email'
  ]
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
