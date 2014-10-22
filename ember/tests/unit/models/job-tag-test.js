import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job-tag', 'JobTag', {
  // Specify the other units that are required for this test.
  needs: ['model:job', 'model:person', 'model:workspace', 'model:task']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});
