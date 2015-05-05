import Ember from 'ember';

export default Ember.Object.extend({
  number: 0,
  weekday: '',
  date: '',
  time: '',
  timezone: '',
  excluded : false,
  exDateText: '',
  exDate: new Date(),
  init: function() {
    var date = moment(this.get('exDateText'));
    this.set('exDate', date);
    this.set('weekday', date.weekday());
    this.set('date', date.format('YYYY-mm-dd'));
  }
});
