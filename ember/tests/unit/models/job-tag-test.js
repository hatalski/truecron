import Ember from "ember";
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

test('belongs to job relationship', function() {
    var JobTag = this.store().modelFor('job-tag');
    var relationship = Ember.get(JobTag, 'relationshipsByName').get('job');
    equal(relationship.key, 'job');
    equal(relationship.kind, 'belongsTo');
});