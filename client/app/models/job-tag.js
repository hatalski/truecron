import DS from 'ember-data';

var JobTag = DS.Model.extend({
    name: DS.attr('string'),
    job:  DS.belongsTo('job', { async: true })
});

JobTag.reopenClass({
  FIXTURES: [
    {
      id: 1,
      name: "web",
      job: 1
    },
    {
      id: 2,
      name: "monitoring",
      job: 1
    }
  ]
});

export default JobTag;
