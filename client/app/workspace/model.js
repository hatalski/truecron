import DS from 'ember-data';

var Workspace =   DS.Model.extend({
  organizationId: DS.attr(), // to prevent ember warning
  name:           DS.attr('string'),
  createdAt:      DS.attr('date'),
  updatedAt:      DS.attr('date'),
  updatedBy:      DS.belongsTo('user', { async: true }),
  organization:   DS.belongsTo('organization', { async: true }),
  jobs:           DS.hasMany('job', { async: true }),
  // history: DS.hasMany('history-record', { async: true }),
  connections:    DS.hasMany('organizations.organization.connection', { async: true })
});

export default Workspace;
