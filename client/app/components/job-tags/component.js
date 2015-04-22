import Ember from 'ember';

export default Ember.Component.extend({
  tags: '',
  didInsertElement: function() {
    "use strict";
    var self = this;

    Ember.Logger.log('job-tags component has been inserted into the dom');
    Ember.Logger.log('tags are: ', self.get('job.tags'));

    Ember.$('#jobTags').selectize({
      plugins: ['remove_button'],
      delimiter: ',',
      persist: false,
      items: self.get('job.tags'),
      //render: {
      //  item: function(data, escape) {
      //    return '<span class="item label label-material-blue-grey-400">' + escape(data.value) + '</span>';
      //  }
      //},
      create: function(input) {
        self.sendAction('action', input);
        return {
          value: input,
          text: input
        };
      }
    });
  }
});
