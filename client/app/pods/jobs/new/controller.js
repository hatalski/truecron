import Ember from 'ember';

export default Ember.Controller.extend({
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
  weekdays: moment.weekdays(),
  zone: 'GMT',
  zones: function() {
    return this.timezoneArray();
  }.property()
});
