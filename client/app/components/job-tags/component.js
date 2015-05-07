import Ember from 'ember';

export default Ember.Component.extend({
  tags: '',
  didInsertElement: function() {
    "use strict";
    var self = this;

    Ember.Logger.log('job-tags component has been inserted into the dom');
    var tags = self.get('job.tags') || [];
    tags = tags.toArray();
    Ember.Logger.log('tags are: ', tags);

    Ember.$('#jobTags').selectize({
      plugins: ['remove_button'],
      delimiter: ',',
      persist: false,
      items: tags,
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
