import Ember from 'ember';

export default Ember.ObjectController.extend({
    needs: ['dashboard'],
    selectedRepeatRule: 'Daily',
    repeatRules: ['Minutely', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    selectedRepeatEvery: 1,
    repeatEvery: function() {
        // console.log('repeatEvery called');
        switch (this.get('selectedRepeatRule')) {
            case 'Minutely':
                return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
            case 'Hourly':
                return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
            default:
                return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
        }
    }.property('selectedRepeatRule'),
	running: false,
    lastRunError: null,
    recurrence: function() {
        var o = RRule.parseString(this.get('model.rrule'));
        var startsAt = this.get('model.startsAt');
        // console.log('startsAt : ' + startsAt);
        if (startsAt === undefined) {
            startsAt = new Date();
        }
        // console.log('startsAt date : ' + new Date(startsAt));
        o.dtstart = new Date(startsAt);
        var rule = new RRule(o);
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
            job.save().then(function(result) {
                console.log('job renamed:');
                console.dir(result);
            }, function(error) {
                console.log('job rename error:');
                console.dir(error);
            });
        },
        addtask: function(job) {
            var self = this;
            var store = this.store;
            console.log('create new task for job : ' + job.get('name'));
            store.find('task-type', -1).then(function(emptyTaskType) {
                var newTask = store.createRecord('task', {
                    name: 'unnamed',
                    settings: '{}',
                    position: job.get('tasks.length') + 1,
                    job: job,
                    taskType: emptyTaskType
                });
                newTask.save().then(function(result) {
                    console.log('new task is created: ');
                    console.dir(result);
                    self.transitionToRoute('dashboard.organization.workspace.tasks.task', result.get('jobId'), result);
                }, function(error) {
                    console.log('task creation failed: ');
                    console.dir(error);
                });
            });
        },
        archive: function(job) {
            job.set('archived', !job.get('archived'));
            job.save().then(function(result) {
                console.log('job successfully archived :');
                console.dir(result);
            }, function(error) {
                console.log('job archive error');
                console.dir(error);
            });
        },
        suspend: function(job) {
            job.set('active', !job.get('active'));
            job.save().then(function(result) {
                console.log('job successfully suspended: ');
                console.dir(result);
            }, function(error) {
                console.log('job suspend failed: ');
                console.dir(error);
            });
        },
        remove: function(job) {
            var self = this;
            job.deleteRecord();
            job.save().then(function(result) {
                console.log('job successfully deleted: ');
                console.dir(result);
                self.transitionToRoute('dashboard.organization.workspace.jobs', result.get('workspace'));
            }, function(error) {
                console.log('job removal failed: ');
                console.dir(error);
            });
        }
    }
});