import DS from 'ember-data';

var JobHistory = DS.Model.extend({
	description:   DS.attr('string'),
  updatedAt:     DS.attr('date'),
	updatedBy:     DS.belongsTo('person', { async: true }),
  job:           DS.belongsTo('job', { async: true })
});

JobHistory.reopenClass({
  FIXTURES: [
    {
      id: 1,
      description: "added 'copy files to FTP' task",
      updatedAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedBy: 2,
      job: 1
    },
    {
      id: 2,
      description: "added 'send notification' task",
      updatedAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedBy: 1,
      job: 1
    },
    {
      id: 3,
      description: "updated 'copy files to FTP' task",
      updatedAt: new Date('2014-09-19T00:00:00.000Z'),
      updatedBy: 2,
      job: 1
    }
  ]
});

export default JobHistory;