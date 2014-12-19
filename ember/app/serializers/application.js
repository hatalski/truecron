import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	keyForRelationship: function(key, relationship) {
    	return Ember.String.underscore(key) + "Id";
    }
});
