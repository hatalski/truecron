import DS from 'ember-data';

var Connection = DS.Model.extend({
  name:          DS.attr('string'),
  settings:      DS.attr('string'),
  createdAt:     DS.attr('date', { defaultValue: new Date() }),
  updatedAt:     DS.attr('date', { defaultValue: new Date() }),
  archived:      DS.attr('boolean'),
  organization:  DS.belongsTo('organization', { async: true }),
  updatedBy:     DS.belongsTo('user', { async: true })
});

export default Connection;
