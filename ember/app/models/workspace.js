import DS from 'ember-data';

var Workspace =   DS.Model.extend({
    name:         DS.attr('string'),
    createdAt:    DS.attr('date'),
    updatedAt:    DS.attr('date'),
    updatedBy:    DS.belongsTo('person', { async: true }),
    jobs:         DS.hasMany('job', { async: true }),
    organization: DS.belongsTo('organization', { async: true })
});

Workspace.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'Development',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [1,2,3,4,5],
      organization: 1
    },
    {
      id: 2,
      name: 'Production',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
      organization: 1
    },
    {
      id: 3,
      name: 'Development',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
      organization: 2
    },
    {
      id: 4,
      name: 'Staging',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
      organization: 2
    },
    {
      id: 5,
      name: 'Production',
      createdAt: new Date(),
      updatedAt: new Date(),
      jobs: [],
      organization: 2
    }
  ]
});

export default Workspace;
