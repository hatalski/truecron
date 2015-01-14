import Ember from "ember";
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('task', 'Task', {
  // Specify the other units that are required for this test.
  needs: [
    'model:job', 
    'model:user', 
    'model:organization', 
    'model:workspace', 
    'model:job-tag', 
    'model:job-history']
});

test('it exists', function() {
  var model = this.subject();
  var store = this.store();
  console.dir(store);
  ok(!!model);
});

test('store create and find task by id', function() {
  var store = this.store();
  var record = null;
  Ember.run(function() {
    store.createRecord('task', {
        id: 2,
        name: 'EDI process execution',
        active: true,
        settings: '',
        position: 1,
        timeout: 1000,
        createdAt: new Date('2014-09-19T00:00:00.000Z'),
        updatedAt: new Date('2014-09-20T00:00:00.000Z')//,
        //job: 1,
        //taskType: 2
      });
    record = store.find('task', 2);
  });
  console.log(record.get('name'));
  equal(record.get('name'), 'EDI process execution');
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
