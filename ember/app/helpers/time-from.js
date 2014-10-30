import Ember from 'ember';

export function timeFrom(date, from) {
  if (moment(date).isValid()) {
    if (moment(from).isValid()) {
      return moment(date).from(from);
    }
    else {
      return moment(date).fromNow();
    }
  }
  else {
    return "never";
  }
};

export default Ember.Handlebars.makeBoundHelper(timeFrom);
