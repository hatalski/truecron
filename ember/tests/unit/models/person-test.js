import Ember from "ember";
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('person', 'Person', {
  // Specify the other units that are required for this test.
  needs: ['model:person', 'model:organization']
});

test('it exists', function() {
  var model = this.subject();
  // var store = this.store();
  ok(!!model);
});

test('has many organizations relationship', function() {
    var Person = this.store().modelFor('person');
    var relationship = Ember.get(Person, 'relationshipsByName').get('organizations');
    equal(relationship.key, 'organizations');
    equal(relationship.kind, 'hasMany');
});

test('belongs to person relationship', function() {
    var Person = this.store().modelFor('person');
    var relationship = Ember.get(Person, 'relationshipsByName').get('updatedBy');
    equal(relationship.key, 'updatedBy');
    equal(relationship.kind, 'belongsTo');
});