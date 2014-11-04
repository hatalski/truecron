import DS from 'ember-data';

var Task = DS.Model.extend({
  name:      DS.attr('string'),
  active:    DS.attr('boolean'),
  settings:  DS.attr('string'),
  position:  DS.attr('number'),
  timeout:   DS.attr('number'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date'),
  updatedBy: DS.belongsTo('person', { async: true }),
  job:       DS.belongsTo('job', { async: true }),
  taskType:  DS.belongsTo('task-type', { async: true })
});

Task.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'clean folder',
      active: true,
      settings: '{}',
      position: 1,
      timeout: 1000,
      createdAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedAt: new Date('2014-09-20T00:00:00.000Z'),
      updatedBy: 1,
      job: 1,
      taskType: 1
    },
    {
      id: 2,
      name: 'EDI process execution',
      active: true,
      settings: '{}',
      position: 2,
      timeout: 1000,
      createdAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedAt: new Date('2014-09-20T00:00:00.000Z'),
      updatedBy: 1,
      job: 1,
      taskType: 2
    },
    {
      id: 3,
      name: 'zip',
      active: true,
      settings: '{}',
      position: 3,
      timeout: 1000,
      createdAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedAt: new Date('2014-09-20T00:00:00.000Z'),
      updatedBy: 1,
      job: 1,
      taskType: 3
    },
    {
      id: 4,
      name: 'copy files to FTP',
      active: true,
      settings: '{}',
      position: 4,
      timeout: 1000,
      createdAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedAt: new Date('2014-09-20T00:00:00.000Z'),
      updatedBy: 1,
      job: 1,
      taskType: 4
    },
    {
      id: 5,
      name: 'send notification',
      active: true,
      settings: '{}',
      position: 5,
      timeout: 1000,
      createdAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedAt: new Date('2014-09-20T00:00:00.000Z'),
      updatedBy: 1,
      job: 1,
      taskType: 5
    }
  ]
});

export default Task;
