import DS from 'ember-data';

var Organization = DS.Model.extend({
  name:       DS.attr('string'),
  email:      DS.attr('string'),
  plan:       DS.attr('string'),
  createdAt:  DS.attr('date', { defaultValue: new Date() }),
  updatedAt:  DS.attr('date', { defaultValue: new Date() }),
  updatedBy:  DS.belongsTo('user', { async: true }),
  workspaces: DS.hasMany('workspace', { async: true }),
  members:    DS.hasMany('user', { async: true })
  // history: DS.hasMany('history-record', { async: true })
});

export default Organization;
