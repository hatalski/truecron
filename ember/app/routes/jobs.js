import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {//params
    //var workspace = params.workspace_id;
    //var organization = params.org_id;
    return this.store.find('job');
  }
});
