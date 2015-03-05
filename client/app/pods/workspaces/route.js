import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      organizations: this.store.find('organization'),
      jobs: [{
        name: 'Test Job Name',
        rrule: 'sample',
        tags: [{name: 'dev'},{name: 'edi'}]
      }, {
        name: 'Test Job Name 2',
        rrule: 'sample 2',
        tags: [{name: 'production'},{name: 'edi'}]
      }]
    }
  }
});
