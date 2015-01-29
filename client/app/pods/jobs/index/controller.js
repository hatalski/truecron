import Ember from 'ember';

export default Ember.Controller.extend({
  invisibleSidebar: false,
  actions: {
    toggleSidebarVisibility: function() {
      "use strict";
      this.toggleProperty('invisibleSidebar');
    }
  }
});
