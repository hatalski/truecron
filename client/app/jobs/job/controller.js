import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['jobs'],
  jobs: Ember.computed.alias("controllers.jobs")//,
  //selectJob: function() {
  //  "use strict";
  //  debugger;
  //  this.get('jobs').selectJob(null);
  //}
});
