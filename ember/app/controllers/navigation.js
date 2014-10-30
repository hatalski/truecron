import Ember from 'ember';

export default Ember.ArrayController.extend({
  organizations: Ember.A([
    Ember.Object.create({name: "About", lastRun: '07/07/14 11:02 pm', nextRun: '07/07/14 11:02 pm', active: true, selected: true}),
    Ember.Object.create({name: "Projects", lastRun: '07/07/14 11:02 pm', nextRun: '07/07/14 11:02 pm', active: false, selected: false})
  ]),
  jobs: {
  },
  title: "TrueCron"
});
