import DS from 'ember-data';

export default DS.Model.extend({
    login:         DS.attr('string'),
    name:          DS.attr('string'),
    passwordSalt:  DS.attr('string'),
    passwordHash:  DS.attr('string'),
    avatarUrl:     DS.attr('string'),
    extensionData: DS.attr('string'),
    lastLoginAt:   DS.attr('date'),
    createdAt:     DS.attr('date'),
    updatedAt:     DS.attr('date')//,
    //updatedBy:     DS.belongsTo('person', { async: true }),
    //organizations: DS.hasMany('organization', { async: true })
});
