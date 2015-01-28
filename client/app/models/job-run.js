/**
 * Created by estet on 1/20/15.
 */
import DS from 'ember-data';

var jobRun = DS.Model.extend({
  guid:         DS.attr('string'),
  jobId:        DS.attr(),
  startDate:    DS.attr('date', { defaultValue: new Date() }),
  elapsedTime:  DS.attr('number'),
  triggeredBy:  DS.attr('string'),
  channelId  :  DS.attr('string'),
  output     :  DS.hasMany('outputMessage', { async: true })
});

export default jobRun;
