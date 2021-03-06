import Ember from 'ember';

export function initialize(/* container, application */) {
  // application.inject('route', 'foo', 'service:foo');
  Ember.View.reopen({
    init: function() {
      this._super();
      var self = this;

      // bind attributes beginning with 'data-'
      Ember.keys(this).forEach(function(key) {
        if (key.substr(0, 5) === 'data-') {
          self.get('attributeBindings').pushObject(key);
        }
      });
    }
  });
}

export default {
  name: 'view',
  initialize: initialize
};
