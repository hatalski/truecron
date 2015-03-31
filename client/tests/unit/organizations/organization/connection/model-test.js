import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('organizations/organization/connection', 'OrganizationsOrganizationConnection', {
  // Specify the other units that are required for this test.
  needs: ['model:organization', 'model:user', 'model:workspace']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
