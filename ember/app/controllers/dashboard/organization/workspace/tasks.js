import Ember from 'ember';

export default Ember.ObjectController.extend({
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
    }.property('model.rrule', 'model.startsAt')
});