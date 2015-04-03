import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    create: function() {
      "use strict";
      this.sendAction('onCreate', this.get('task'));
    },
    cancel: function() {
      "use strict";
      this.sendAction('onCancel');
    }
  }
});
