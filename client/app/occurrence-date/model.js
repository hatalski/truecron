import Ember from 'ember';

export default Ember.Object.extend({
  number: 0,
  weekday: '',
  date: '',
  time: '',
  timezone: '',
  excluded : false,
  excludedText: function()
  {
    return this.get('excluded') ? 'yes' : 'no';
  }.property('excluded'),
  occDateText: '',
  occDate: new Date(),
  init: function() {
    var date = moment(this.get('occDateText'));
    this.set('occDate', date.toDate());
    this.set('weekday', date.format('dddd'));
    this.set('date', date.format('MM/DD/YYYY'));
    this.set('time', date.format('HH:mm:ss'));
  }
});
