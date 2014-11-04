import Ember from "ember";
import DS from 'ember-data';
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
    console.dir(model);
    // var store = this.store();
    ok(!!model);
});

test('store create and find job by id', function() {
    var store = this.store();
    var record = null;
    Ember.run(function() {
        store.createRecord('job', { id: 1, name: 'Job A', startsAt: new Date("2014-09-20T00:00:00.000Z"), rrule: 'FREQ=WEEKLY;COUNT=30;WKST=MO', active: true, archived: false, createdAt: new Date('2014-09-19T00:00:00.000Z'), updatedAt: new Date('2014-09-20T00:00:00.000Z') });
        record = store.find('job', 1);
    });
    console.log(record.get('name'));
    equal(record.get('name'), 'Job A');
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
