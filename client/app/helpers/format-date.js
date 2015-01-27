import Ember from 'ember';

export function formatDate(date, format) {
  if (moment(date).isValid()) {
    return moment(date).format(format);
  }
  else {
    return "never";
  }
}

export default Ember.Handlebars.makeBoundHelper(formatDate);
