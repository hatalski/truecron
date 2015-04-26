import DS from 'ember-data';
import JobStatuses from 'true-cron/models/job-status';

var Job = DS.Model.extend({
  workspaceId: DS.attr(),
  name:        DS.attr('string'),
  // tags will be send as array to server-side,
  // no need to have job-tags model, since there is no API for tags
  tags:        DS.attr({ defaultValue: []}),
  active:      DS.attr('boolean', { defaultValue: true }),
  archived:    DS.attr('boolean', { defaultValue: false }),
  createdAt:   DS.attr('date', { defaultValue: new Date() }),
  updatedAt:   DS.attr('date', { defaultValue: new Date() }),
  updatedBy:   DS.belongsTo('user', { async: true }),
  workspace:   DS.belongsTo('workspace', { async: true }),
  schedule:    DS.attr({ defaultValue: { dtStart: new Date(), rrule: '' }}),
  // tags will be send as array to server-side,
  // no need to have job-tags model, since there is no API for tags
  runs:        DS.hasMany('run', { async: true }),
  history:     DS.hasMany('history', { async: true }),
  tasks:       DS.hasMany('task', { async: true }),
  statusId:    DS.attr('number', { defaultValue: 0 }),
  status:      function() {
    return {
      id:   this.get('statusId'),
      name: JobStatuses[this.get('statusId')].name
    };
  }.property('statusId')
});

export default Job;
