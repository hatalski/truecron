import DS from 'ember-data';

var User = DS.Model.extend({
    login:         DS.attr('string'),
    name:          DS.attr('string'),
    passwordSalt:  DS.attr('string'),
    passwordHash:  DS.attr('string'),
    avatarUrl:     DS.attr('string'),
    extensionData: DS.attr('string'),
    lastLoginAt:   DS.attr('date'),
    createdAt:     DS.attr('date'),
    updatedAt:     DS.attr('date'),
    updatedBy:     DS.belongsTo('user', { async: true }),
    organizations: DS.hasMany('organization', { async: true })
});

User.reopenClass({
  FIXTURES: [
    {
      id: 'current',
      login: 'vitali.hatalski@truecron.com',
      name: 'Vitali Hatalski',
      passwordSalt: '',
      passwordHash: '',
      avatarUrl: '',
      extensionData: '',
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedBy: 1,
      organizations: [1,2]
    },
    {
      id: 2,
      login: 'lev.kurts@truecron.com',
      name: 'Lev Kurts',
      passwordSalt: '',
      passwordHash: '',
      avatarUrl: '',
      extensionData: '',
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedBy: 2,
      organizations: [1,2]
    }
  ]
});

export default User;
