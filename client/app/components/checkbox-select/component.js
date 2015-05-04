import Ember from 'ember';

export default Ember.Component.extend({
  /* The property to be used as label */
  labelPath: null,
  /* The model */
  model: null,
  /* The has many property from the model */
  propertyPath: null,
  /* All possible elements, to be selected */
  elements: null,
  elementsOfProperty: function() {
    return this.get('model.' + this.get('propertyPath'));
  }.property()
});
