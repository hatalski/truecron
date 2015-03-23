import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find('organization');
  }//,
  //afterModel: function(model) {
  //  "use strict";
  //  var self = this;
  //  var org = model.get('firstObject');
  //  this.store.find('workspace', { organizationId: org.get('id') }).then(function(workspaces) {
  //    var length = workspaces.get('length');
  //    Ember.Logger.log(length);
  //    var firstWorkspace = workspaces.get('firstObject');
  //    debugger;
  //    self.transitionTo('jobs', firstWorkspace.get('id'));
  //  });
  //}
});
