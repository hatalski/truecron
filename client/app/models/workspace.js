import DS from 'ember-data';

var Workspace =     DS.Model.extend({
    organizationId: DS.attr(), // to prevent ember warning
    name:           DS.attr('string'),
    createdAt:      DS.attr('date'),
    updatedAt:      DS.attr('date'),
    updatedBy:      DS.belongsTo('user', { async: true }),
    organization:   DS.belongsTo('organization', { async: true }),
    jobs:           DS.hasMany('job', { async: true }),
    // history: DS.hasMany('history-record', { async: true }),
    connections:    DS.hasMany('connection', { async: true })
});

Workspace.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'Development',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      jobs: [1,2,3,5],
      connections: [1,2,3],
      organization: 1
    },
    {
      id: 2,
      name: 'Production',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      jobs: [4,6],
      connections: [],
      organization: 1
    },
    {
      id: 3,
      name: 'Development',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      jobs: [],
      connections: [],
      organization: 2
    },
    {
      id: 4,
      name: 'Staging',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      jobs: [],
      connections: [],
      organization: 2
    },
    {
      id: 5,
      name: 'Production',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 1,
      jobs: [],
      connections: [],
      organization: 2
    }
  ]
});

export default Workspace;