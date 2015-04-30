import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    return this.store.find('organization');
  },
  afterModel: function(model) {
    "use strict";
    this.controllerFor('application').set('organizations', model);
  }
});
