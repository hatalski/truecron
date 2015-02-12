import DS from 'ember-data';

var JobHistory = DS.Model.extend({
  description:   DS.attr('string'),
  updatedAt:     DS.attr('date'),
  updatedBy:     DS.belongsTo('user', { async: true }),
  job:           DS.belongsTo('job', { async: true })
});

export default JobHistory;
