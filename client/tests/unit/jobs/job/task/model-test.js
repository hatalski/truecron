import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('jobs/job/task', {
  // Specify the other units that are required for this test.
  needs: ['model:user',
    'model:workspace',
    'model:organization',
    'model:job',
    'model:job-tag',
    'model:jobs.job.task']
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});
