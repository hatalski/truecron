import Ember from 'ember';

export default Ember.ArrayController.extend({
  organizations: Ember.A([
    Ember.Object.create({title: "About", location: 'about', active: null}),
    Ember.Object.create({title: "Projects", location: 'projects', active: null})
  ]),
  title: "TrueCron"
});
