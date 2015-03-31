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
  messages: [],
  taskType:  function() {
    return {
      id:   this.get('taskTypeId'),
      name: TaskTypes[this.get('taskTypeId')].name
    };
  }.property('taskTypeId')
});

export default Task;
