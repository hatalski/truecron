import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job-history', 'JobHistory', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:job', 'model:job-tag', 'model:task', 'model:workspace']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
