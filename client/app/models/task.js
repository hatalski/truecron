import DS from 'ember-data';
import TaskTypes from 'true-cron/models/task-type';

var Task = DS.Model.extend({
  jobId:     DS.attr(),
  name:      DS.attr('string'),
  active:    DS.attr('boolean', { defaultValue: true }),
  settings:  DS.attr('string'),
  position:  DS.attr('number'),
  timeout:   DS.attr('number', { defaultValue: 30000 }),
  createdAt: DS.attr('date', { defaultValue: new Date() }),
  updatedAt: DS.attr('date', { defaultValue: new Date() }),
  updatedBy: DS.belongsTo('user', { async: true }),
  job:       DS.belongsTo('job', { async: true }),
  taskTypeId:DS.attr('number', { defaultValue: 0 }),
  taskType:  function() {
    return {
      id:   this.get('taskTypeId'),
      name: TaskTypes[this.get('taskTypeId')].name
    };
  }.property('taskTypeId')
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
      taskTypeId: 1
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
      taskTypeId: 2
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
      taskTypeId: 3
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
      taskTypeId: 4
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
      taskTypeId: 5
    }
  ]
});

export default Task;
