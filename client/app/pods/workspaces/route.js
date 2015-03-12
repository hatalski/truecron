import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.find('organization');
    //  jobs: [{
    //    name: 'Job that never run',
    //    statusId: 0,
    //    status: 'never',
    //    startsAt: new Date(),
    //    rrule: 'FREQ=WEEKLY;DTSTART=20150301T090100Z;WKST=SU',
    //    tags: [{name: 'dev'}, {name: 'edi'}]
    //  }, {
    //    name: 'Job that failed on last run',
    //    statusId: 1,
    //    status: 'failed',
    //    startsAt: new Date(),
    //    rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
    //    tags: [{name: 'production'}, {name: 'edi'}]
    //  }, {
    //    name: 'Job that ran successfully last time',
    //    statusId: 2,
    //    status: 'success',
    //    startsAt: new Date(),
    //    rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
    //    tags: [{name: 'staging'}, {name: 'edi'}]
    //  }, {
    //    name: 'Job is currently running',
    //    statusId: 3,
    //    status: 'running',
    //    startsAt: new Date(),
    //    rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
    //    tags: [{name: 'staging'}, {name: 'edi'}]
    //  }]
    //};
  },
  afterModel: function(model) {
    "use strict";
    var self = this;
    var org = model.get('firstObject');
    this.store.find('workspace', { organizationId: org.get('id') }).then(function(workspaces) {
      var length = workspaces.get('length');
      Ember.Logger.log(length);
      var firstWorkspace = workspaces.get('firstObject');
      debugger;
      self.transitionTo('workspaces.workspace.jobs', firstWorkspace);
    });
  }
});
