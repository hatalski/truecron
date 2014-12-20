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

Organization.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'Personal',
      email: '',
      plan: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      workspaces: [1,2],
      members: [1]
    },
    {
      id: 2,
      name: 'Pied Piper',
      email: '',
      plan: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      workspaces: [3,4,5],
      members: [1]
    }
  ]
});

export default Organization;
