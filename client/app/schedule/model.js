import DS from 'ember-data';

export default DS.ModelFragment.extend({
  dtStart: DS.attr('date'),
  rrule: DS.attr('string')
});
