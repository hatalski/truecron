/**
 * Created by estet on 1/20/15.
 */
import DS from 'ember-data';

var Run = DS.Model.extend({
  workspaceId     : DS.attr(),
  organizationId  : DS.attr(),
  guid            : DS.attr('string'),
  jobId           : DS.attr(),
  startedAt       : DS.attr('date', { defaultValue: new Date() }),
  elapsed         : DS.attr('number'),
  status          : DS.attr('number', { defaultValue: 0 }),
  triggeredBy     : DS.attr('string'),
  channelId       : DS.attr('string'),
  output          : DS.hasMany('outputMessage', { async: true })
});

export default Run;
