import DS from 'ember-data';

var User =       DS.Model.extend({
  name:          DS.attr('string'),
  password:      DS.attr('string'),
  avatarUrl:     DS.attr('string'),
  extensionData: DS.attr(),
  lastLoginAt:   DS.attr('date'),
  createdAt:     DS.attr('date'),
  updatedAt:     DS.attr('date'),
  updatedBy:     DS.belongsTo('user', { async: true }),
  emails:        DS.hasMany('email', { async: true })
});

export default User;
