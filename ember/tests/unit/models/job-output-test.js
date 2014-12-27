import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job-output', 'JobOutput', {
  // Specify the other units that are required for this test.
  needs: ['model:job', 'model:job-tag', 'model:job-history', 'model:task', 'model:user', 'model:workspace']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
