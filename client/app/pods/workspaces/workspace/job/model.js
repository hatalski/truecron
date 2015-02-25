import DS from 'ember-data';

var Job = DS.Model.extend({
  workspaceId: DS.attr(),
  name:        DS.attr('string'),
  startsAt:    DS.attr('date'),
  rrule:       DS.attr('string'),
  active:      DS.attr('boolean', { defaultValue: true }),
  archived:    DS.attr('boolean', { defaultValue: false }),
  createdAt:   DS.attr('date', { defaultValue: new Date() }),
  updatedAt:   DS.attr('date', { defaultValue: new Date() }),
  updatedBy:   DS.belongsTo('user', { async: true }),
  workspace:   DS.belongsTo('workspace', { async: true }),
  tags:        DS.hasMany('job-tag', { async: true }),
  //history:     DS.hasMany('job-history', { async: true }),
  tasks:       DS.hasMany('workspaces.workspace.jobs.job.task', { async: true })
});

export default Job;
