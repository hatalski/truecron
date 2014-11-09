import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return this.store.find('workspace', params.workspace_name);
	},
	serialize: function(model) {
		// this will make the URL `/posts/foo-post`
		return { workspace_name: model.get('name') };
	}
});
