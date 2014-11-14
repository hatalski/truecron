import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
  	console.log(params.task_id);
    return this.store.find('task', params.task_id);
  }//,
  // serialize: function(model) {
  // 	console.dir(model.get('id'));
  //   return { task_id: model.get('id'), job_id: model.job.id };
  // }
});
