import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    "use strict";
    // this.modelFor("workspaces.workspace").get('jobs');
    return {
      jobs: [{
        name: 'Job that never run',
        statusId: 0,
        status: 'never',
        startsAt: new Date(),
        rrule: 'FREQ=WEEKLY;DTSTART=20150301T090100Z;WKST=SU',
        tags: [{name: 'dev'}, {name: 'edi'}]
      }, {
        name: 'Job that failed on last run',
        statusId: 1,
        status: 'failed',
        startsAt: new Date(),
        rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
        tags: [{name: 'production'}, {name: 'edi'}]
      }, {
        name: 'Job that ran successfully last time',
        statusId: 2,
        status: 'success',
        startsAt: new Date(),
        rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
        tags: [{name: 'staging'}, {name: 'edi'}]
      }, {
        name: 'Job is currently running',
        statusId: 3,
        status: 'running',
        startsAt: new Date(),
        rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
        tags: [{name: 'staging'}, {name: 'edi'}]
      }]
    };
  }
});
