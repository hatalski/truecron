import DS from 'ember-data';

var Connection = DS.Model.extend({
    name:      DS.attr('string'),
    settings:  DS.attr('string'),
    createdAt: DS.attr('date', { defaultValue: new Date() }),
    updatedAt: DS.attr('date', { defaultValue: new Date() }),
    archived:  DS.attr('boolean'),
    updatedBy: DS.belongsTo('user', { async: true })
});

Connection.reopenClass({
    FIXTURES: [
        {
            id: 1,
            name: 'SFTP Connection',
            settings: '{}',
            createdAt: new Date('2014-09-19T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: false,
            updatedBy: 1
        },
        {
            id: 2,
            name: 'SMTP Server',
            settings: '{}',
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: true,
            updatedBy: 1
        },
        {
            id: 3,
            name: 'Agent',
            settings: '{}',
            createdAt: new Date('2014-09-20T00:00:00.000Z'),
            updatedAt: new Date('2014-09-20T00:00:00.000Z'),
            archived: false,
            updatedBy: 1
        }
    ]
});

export default Connection;