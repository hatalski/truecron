import Ember from "ember";
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('workspace', 'Workspace', {
  // Specify the other units that are required for this test.
  needs: [
    'model:job', 
    'model:user', 
    'model:connection',
    'model:organization', 
    'model:job-tag', 
    'model:job-history', 
    'model:task']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('has many jobs relationship', function() {
    var Workspace = this.store().modelFor('workspace');
    var relationship = Ember.get(Workspace, 'relationshipsByName').get('jobs');
    equal(relationship.key, 'jobs');
    equal(relationship.kind, 'hasMany');
});

test('belongs to person relationship', function() {
    var Workspace = this.store().modelFor('workspace');
    var relationship = Ember.get(Workspace, 'relationshipsByName').get('updatedBy');
    equal(relationship.key, 'updatedBy');
    equal(relationship.kind, 'belongsTo');
});

test('belongs to organization relationship', function() {
    var Workspace = this.store().modelFor('workspace');
    var relationship = Ember.get(Workspace, 'relationshipsByName').get('organization');
    equal(relationship.key, 'organization');
    equal(relationship.kind, 'belongsTo');
});