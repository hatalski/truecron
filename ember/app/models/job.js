import DS from 'ember-data';

var Job = DS.Model.extend({
    name:      DS.attr('string'),
    startsAt:  DS.attr('date'),
    rrule:     DS.attr('string'),
    active:    DS.attr('boolean', { defaultValue: true }),
    archived:  DS.attr('boolean', { defaultValue: false }),
    createdAt: DS.attr('date', { defaultValue: new Date() }),
    updatedAt: DS.attr('date', { defaultValue: new Date() }),
    updatedBy: DS.belongsTo('user', { async: true }),
    workspace: DS.belongsTo('workspace', { async: true }),
    tags:      DS.hasMany('job-tag', { async: true }),
    history:   DS.hasMany('job-history', { async: true }),
    tasks:     DS.hasMany('task', { async: true })
});

Job.reopenClass({
    FIXTURES: [
        {
            id: 1,
            name: 'Corporate Website Monitoring',
            startsAt: new Date("2014-09-20T00:00:10.000Z"),
            rrule: 'FREQ=WEEKLY;WKST=MO;INTERVAL=2;BYDAY=MO,FR;COUNT=5',
            active: true,
            archived: false,
            createdAt: new Date('2014-09-19T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [1,2,3],
            workspace: 1,
            tags: [1,2],
            tasks: [1,2,3,4,5]
        },
        {
            id: 2,
            name: 'Database Site Backup',
            startsAt: new Date('2014-10-21T00:04:00.000Z'),
            rrule: 'FREQ=MONTHLY;BYDAY=+3TU',
            active: true,
            archived: false,
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [],
            tags: [],
            workspace: 1,
            tasks: []
        },
        {
            id: 3,
            name: 'Weekly Accounting Report',
            startsAt: new Date('2014-10-21T00:04:00.000Z'),
            rrule: 'INTERVAL=6;FREQ=MONTHLY',
            active: false,
            archived: false,
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [],
            tags: [],
            workspace: 1,
            tasks: []
        },
        {
            id: 4,
            name: 'Intranet Monitoring',
            startsAt: new Date('2014-10-21T00:04:00.000Z'),
            rrule: 'FREQ=HOURLY;INTERVAL=3;WKST=MO',
            active: true,
            archived: true,
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [],
            tags: [],
            workspace: 2,
            tasks: []
        },
        {
            id: 5,
            name: 'New Clients Report',
            startsAt: new Date('2014-10-21T00:04:00.000Z'),
            rrule: 'FREQ=HOURLY;INTERVAL=3;WKST=MO',
            active: true,
            archived: false,
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [],
            tags: [],
            workspace: 1,
            tasks: []
        },
        {
            id: 6,
            name: 'New Clients Report',
            startsAt: new Date('2014-10-21T00:04:00.000Z'),
            rrule: 'FREQ=HOURLY;INTERVAL=3;WKST=MO',
            active: true,
            archived: false,
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            history: [],
            tags: [],
            workspace: 2,
            tasks: []
        }
    ]
});

export default Job;
