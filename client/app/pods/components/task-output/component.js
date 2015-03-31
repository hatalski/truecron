import Ember from 'ember';

export default Ember.Component.extend({
  init: function () {
    this.set('messages', []);
    this._super();
  },
  tagName: 'div',
  task: null,
  updateMessages:function(){
    console.log('Observe called');
    console.log(this.get('task.messages'));
  }.observes('task.messages'),
  actions:
  {
    updateMessages:function()
    {
      this.set('task.messages',['123123','234234']);
    }
  }
});
