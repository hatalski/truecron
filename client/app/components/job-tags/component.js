import Ember from 'ember';

export default Ember.Component.extend({
  initializeSelectize: function() {
    "use strict";
    Ember.Logger.log('job-tags component has been inserted into the dom');
  }.on('didInsertElement')
});
