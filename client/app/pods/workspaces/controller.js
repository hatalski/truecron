import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    changeWorkspace: function(workspace) {
      "use strict";
      Ember.Logger.log(workspace);
      this.transitionToRoute('workspaces.workspace', workspace);
    }
  }
});
