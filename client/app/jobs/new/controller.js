import Ember from 'ember';
import RRuleParser from 'true-cron/mixins/rrule-parser';

export default Ember.Controller.extend(RRuleParser, {
  needs: ['jobs'],
  name: '',
  currentDate: moment().format('YYYY-MM-DD'),
  currentTime: moment().format('HH:mm'),
  currentZone: moment().zone(),
  //current: function() {
  //  "use strict";
  //  var value = this.get('currentDate') + this.get('currentTime');
  //  Ember.Logger.log(value);
  //  return value;
  //}.property('currentDate', 'currentTime'),
  timezoneArray: function() {
    "use strict";
    var zones = moment.tz.names();
    var length = zones.length;
    var now = moment().valueOf();

    var result = [];
    for (var i = 0; i < length; i ++) {
      var zone = zones[i];
      result.push({
        name:   zone,
        offset: moment.tz.zone(zone).offset(now),
        abbr:   moment.tz.zone(zone).abbr(now)
      });
    }
    return result;
  },
  zone: 'GMT',
  zones: function() {
    return this.timezoneArray();
  }.property(),
  actions: {
    createNewJob: function() {
      "use strict";
      var self = this;
      var newJob = self.get('model');
      Ember.Logger.log('new job is about to save: ', newJob);
      newJob.save().then(function() {
        Ember.Logger.log('Job has been saved');
        self.controllerFor('jobs').set('showJobDetails', false);
        self.controllerFor('jobs').set('selectedJob', null);
        self.controllerFor('jobs').set('newJob', null);
        self.transitionToRoute('jobs.job', newJob.get('workspace'), newJob);
      });
    },
    cancelNewJob: function() {
      "use strict";
      var job = this.get('model');
      Ember.Logger.log('cancel job: ', job);
      this.get('controllers.jobs').set('showJobDetails', false);
      this.get('controllers.jobs').set('newJob', null);
      this.transitionToRoute('jobs', job.get('workspaceId'));
    }
  }
});
