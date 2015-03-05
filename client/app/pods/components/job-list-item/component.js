import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['list-group-item'],
  actions: {
    test: function() {
      "use strict";
      return "test";
    }
  }
});
