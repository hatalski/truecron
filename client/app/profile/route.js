import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    Ember.Logger.log('session: ', this.get('session'));
    Ember.Logger.log('session user id: ', this.get('session.userId'));
    return this.store.find('user', this.get('session.userId'));
  }
});
