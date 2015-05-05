import Ember from 'ember';

export default Ember.Object.extend({
  emptyDateValue: ' -- / -- / -- ',
  fromDate: null,
  toDate: null,
  fromDateText: function()
  {
    return moment(this.get('fromDate')).format('dddd    MMMM / DD / YYYY');
  }.property('fromDate'),
  toDateText: function()
  {
    var date = moment(this.get('toDate'));
    if(date.isValid()) {
      return date.format('dddd    MMMM / DD / YYYY');
    }
    else
    {
      return this.get('emptyDateValue');
    }
  }.property('toDate')
});
