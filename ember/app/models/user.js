import DS from 'ember-data';

var User = DS.Model.extend({
    name:          DS.attr('string'),
    avatarUrl:     DS.attr('string'),
    extensionData: DS.attr('string'),
    lastLoginAt:   DS.attr('date'),
    createdAt:     DS.attr('date'),
    updatedAt:     DS.attr('date'),
    updatedBy:     DS.belongsTo('user', { async: true })
});

User.reopenClass({
  FIXTURES: [
    {
      id: 'current',
      name: 'vitali.hatalski@truecron.com',
      avatarUrl: '',
      extensionData: '',
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedBy: 1
    },
    {
      id: 2,
      name: 'lev.kurts@truecron.com',
      avatarUrl: '',
      extensionData: '',
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedBy: 2
    }
  ]
});

export default User;
