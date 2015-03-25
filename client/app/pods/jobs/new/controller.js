import Ember from 'ember';

export default Ember.Controller.extend({
  item: {id: 1, name: 'UTC'},
  items: [{id: 1, name: 'UTC'}, { id: 2, name: 'GMT +2'}, { id: 3, name: 'GMT +3'}]
});
