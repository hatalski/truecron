import DS from 'ember-data';

var TaskType = DS.Model.extend({
    name: DS.attr('string')
});

TaskType.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: 'file'
    },
    {
      id: 2,
      name: 'execute'
    },
    {
      id: 3,
      name: 'archive'
    },
    {
      id: 4,
      name: 'sftp'
    },
    {
      id: 5,
      name: 'smtp'
    },
    {
      id: 6,
      name: 'http'
    },
    {
      id: 7,
      name: 'empty'
    }
  ]
});

export default TaskType;
