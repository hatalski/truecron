import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	//serializer: DS.JSONSerializer.create({container: Ember.App.__container__})
    // primaryKey: '_id'
 //    serializeBelongsTo: function(record, json, relationship) {
	//     var key = relationship.key,
	//         belongsToRecord = Ember.get(record, key);
	     
	//     if (relationship.options.embedded === 'always') {
	//         json[key] = belongsToRecord.serialize();
	//     }
	//     else {
	//         return this._super(record, json, relationship);
	//     }
	// }
});
