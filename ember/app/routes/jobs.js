import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		console.log(params);
		//var organizations = this.store.find('job');
		return this.store.find('person', 1);
	}
});
