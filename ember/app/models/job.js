import DS from 'ember-data';

var Job = DS.Model.extend({
    name:      DS.attr('string'),
    startsAt:  DS.attr('date'),
    rrule:     DS.attr('string'),
    active:    DS.attr('boolean', { defaultValue: true }),
    archived:  DS.attr('boolean', { defaultValue: false }),
    createdAt: DS.attr('date', { defaultValue: new Date() }),
    updatedAt: DS.attr('date', { defaultValue: new Date() }),
    updatedBy: DS.belongsTo('person', { async: true }),
    workspace: DS.belongsTo('workspace', { async: true }),
    tags:      DS.hasMany('job-tag', { async: true }),
    tasks:     DS.hasMany('task', { async: true })
});

Job.reopenClass({
    FIXTURES: [
        { id: 1, name: 'Job A', startsAt: new Date("2014-09-20T00:00:00.000Z"), rrule: 'FREQ=WEEKLY;COUNT=30;WKST=MO', active: true, archived: false, createdAt: new Date('2014-09-19T00:00:00.000Z'), updatedAt: new Date('2014-09-20T00:00:00.000Z') },
        { id: 2, name: 'Job B', startsAt: new Date('2014-10-21T00:00:00.000Z'), rrule: 'FREQ=HOURLY;INTERVAL=3;WKST=MO', active: true, archived: false, createdAt: new Date('2014-09-20T00:00:00.000Z'), updatedAt: new Date('2014-09-20T00:00:00.000Z') }
    ]
});

export default Job;