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
