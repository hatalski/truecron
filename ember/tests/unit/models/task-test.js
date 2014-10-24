import Ember from "ember";
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('task', 'Task', {
  // Specify the other units that are required for this test.
  needs: ['model:job', 'model:person', 'model:organization', 'model:workspace', 'model:job-tag', 'model:task-type']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('belongs to person relationship', function() {
    var Task = this.store().modelFor('task');
    var relationship = Ember.get(Task, 'relationshipsByName').get('updatedBy');
    equal(relationship.key, 'updatedBy');
    equal(relationship.kind, 'belongsTo');
});

test('belongs to job relationship', function() {
    var Task = this.store().modelFor('task');
    var relationship = Ember.get(Task, 'relationshipsByName').get('job');
    equal(relationship.key, 'job');
    equal(relationship.kind, 'belongsTo');
});

test('belongs to task type relationship', function() {
    var Task = this.store().modelFor('task');
    var relationship = Ember.get(Task, 'relationshipsByName').get('taskType');
    equal(relationship.key, 'taskType');
    equal(relationship.kind, 'belongsTo');
});