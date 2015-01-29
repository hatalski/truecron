import Ember from 'ember';

export default Ember.Component.extend({
  condition: null,
  updateVisibilityState: function() {
    "use strict";
    if (this.get('condition')) {
      this.$().hide('drop', {}, 100);
    } else {
      this.$().show('drop', {}, 100);
    }
  }.on('didInsertElement').observes('condition')
});
