import Ember from 'ember';

export default Ember.ObjectController.extend({
  selected: function() {
    var activity = this.get('content');
    var children = this.get('parentController.elementsOfProperty');
    return children.contains(activity);
  }.property(),
  label: function() {
    debugger;
    return this.get('model.' + this.get('parentController.labelPath'));
  }.property(),
  selectedChanged: function() {
    var activity = this.get('content');
    var children = this.get('parentController.elementsOfProperty');
    if (this.get('selected')) {
      children.pushObject(activity);
    } else {
      children.removeObject(activity);
    }
  }.observes('selected')
});
