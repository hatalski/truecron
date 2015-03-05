import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      organizations: this.store.find('organization'),
      jobs: [{
        name: 'Test Job Name',
        startsAt: new Date(),
        rrule: 'FREQ=WEEKLY;DTSTART=20150301T090100Z;WKST=SU',
        tags: [{name: 'dev'},{name: 'edi'}]
      }, {
        name: 'Test Job Name 2',
        startsAt: new Date(),
        rrule: 'FREQ=HOURLY;DTSTART=20150305T210000Z;INTERVAL=4;WKST=MO',
        tags: [{name: 'production'},{name: 'edi'}]
      }]
    };
  }
});
