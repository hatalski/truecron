import Ember from 'ember';

export default Ember.ObjectController.extend({
    selectedRepeatRule: 'Daily',
    repeatRules: ['Minutely', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'],
    selectedRepeatEvery: 1,
  chatRoomInputText: null,
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
        run: function(job) {
          var socket = window.io('ws://dev.truecron.com:3000');
          if(this.get('running') !== true)
          {
            socket.connect();
            socket.on('connect', function(){
              console.log('client connected');
              socket.on('tco' + job.get('id'), function(msg){
                console.log('response message: ' + msg);
              });
            });
          }
          else
          {
            socket.disconnect();
          }

          this.set('running', !this.get('running'));
          console.log((this.get('running') ? 'runnning':'stop running') + ' job ' + job.get('name'));

        },
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
        reschedule: function(job) {
            var recurrence = job.get('recurrence');
            console.dir('reschedule has been called', recurrence);
        },
        addtask: function(job) {
            console.log('create new task for job : ' + job.get('name'));
            var self = this;
            var user = self.get('session.user');
            self.store.find('task-type', -1).then(function(emptyTaskType) {
                var newTask = self.store.createRecord('task', {
                    name: 'unnamed',
                    settings: '{}',
                    position: job.get('tasks.length') + 1,
                    job: job,
                    taskType: emptyTaskType,
                    updatedBy: user
                });
                newTask.save().then(function(result) {
                    console.log('new task is created:');
                    console.dir(result);
                    self.transitionToRoute('dashboard.organization.workspace.tasks.task', result.get('jobId'), result);
                }, function(error) {
                    console.log('new task creation error');
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
          job.save().then(function (result) {
            console.log('job successfully deleted: ');
            console.dir(result);
            self.transitionToRoute('dashboard.organization.workspace.jobs', result.get('workspace'));
          }, function (error) {
            console.log('job removal failed: ');
            console.dir(error);
          });
        },
      onopen: function(socketEvent) {
        console.log('On open has been called!' + socketEvent);
      },
      onmessage: function(socketEvent) {
        console.log('On message has been called!' + socketEvent);
      },
      onclose: function(socketEvent) {
        console.log('On close has been called!' + socketEvent);
      },
      onerror: function(socketEvent) {
        console.log('On error has been called! :-(' + socketEvent);
      }
    }
});
