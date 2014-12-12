import Ember from 'ember';
import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function(params) {
  	console.log('load job ' + params);
    return this.store.find('job', params.job_id);
  }
});
