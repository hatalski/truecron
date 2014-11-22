import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['dashboard'],
	recurrence: function() {
        var o = RRule.parseString(this.get('model.rrule'));
        o.dtstart = this.get('model.startsAt');

        var rule = new RRule(o);
        console.dir('rrule : ' + rule.toText());
        var now = new Date();
        return {
            text:    rule.toText(),
            lastRun: rule.before(now, true),
            nextRun: rule.after(now, true)
        };
    }.property('model.rrule', 'model.startsAt'),
    actions: {
        rename: function(job) {
            console.log('rename to : ' + job.get('name'));
            job.save();
        },
        addtask: function(job) {
            var self = this;
            var store = this.store;
            console.log('create new task for job : ' + job.get('name'));
            store.find('task-type', 7).then(function(emptyTaskType) {
                var newTask = store.createRecord('task', {
                    name: 'unnamed',
                    settings: '{}',
                    position: job.get('tasks.length') + 1,
                    job: job,
                    taskType: emptyTaskType
                });
                console.dir('new task is created: ' + newTask);
                self.transitionToRoute('dashboard.organization.workspace.tasks.task', newTask.get('job.id'), newTask);
            });
        }
    }
});