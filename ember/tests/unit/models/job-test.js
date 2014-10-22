import Ember from "ember";
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('job', 'Job', {
  // Specify the other units that are required for this test.
  needs: ['model:task', 'model:person', 'model:workspace', 'model:organization', 'model:job-tag', 'model:task-type']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('has many tasks relationship', function() {
    var Job = this.store().modelFor('job');
    var relationship = Ember.get(Job, 'relationshipsByName').get('tasks');
    equal(relationship.key, 'tasks');
    equal(relationship.kind, 'hasMany');
});

test('has many job tags relationship', function() {
    var Job = this.store().modelFor('job');
    var relationship = Ember.get(Job, 'relationshipsByName').get('tags');
    equal(relationship.key, 'tags');
    equal(relationship.kind, 'hasMany');
});

test('updated by person relationship', function() {
    var Job = this.store().modelFor('job');
    var relationship = Ember.get(Job, 'relationshipsByName').get('updatedBy');
    equal(relationship.key, 'updatedBy');
    equal(relationship.kind, 'belongsTo');
});

test('belongs to workspace relationship', function() {
    var Job = this.store().modelFor('job');
    var relationship = Ember.get(Job, 'relationshipsByName').get('workspace');
    equal(relationship.key, 'workspace');
    equal(relationship.kind, 'belongsTo');
});