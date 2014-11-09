import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('organizations', params.organization_name);
	},
	serialize: function(model) {
		// this will make the URL `/posts/foo-post`
		return { organization_name: model.get('name') };
	}
});
