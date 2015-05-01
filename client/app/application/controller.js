import Ember from 'ember';
import ENV from 'true-cron/config/environment';

export default Ember.Controller.extend({
  currentChoice: function() {
    "use strict";
    if (this.get('model')) {
      return this.get('model.organization.name') + " / " +this.get('model.name');
    }
    return "Choose workspace";
  }.property("model"),
  organizations: null,
  hideSignUpButton: ENV.APP.HIDE_SIGNUP,
  actions: {
    redirectToSignup: function() {
      this.transitionToRoute('signup');
    },
    redirectToSignin: function() {
      this.transitionToRoute('signin');
    },
    changeWorkspace: function(workspace) {
      "use strict";
      //this.set('currentWorkspace', workspace.get('name'));
      this.transitionToRoute('jobs', workspace);
    }
  }
});
