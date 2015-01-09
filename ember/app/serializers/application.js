//import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	keyForRelationship: function(key, relationship) {
		return relationship === "belongsTo" ? key + "Id" : key;
    },
    normalizeHash: {
		organizationId: function(hash) {
			//console.log(' hash : ' + hash);
			hash.organization = hash.organizationId;
			delete hash.organizationId;

			return hash;
		},
		workspaceId: function(hash) {
			//console.log(' hash : ' + hash);
			hash.workspace = hash.workspaceId;
			//delete hash.workspaceId;

			return hash;
		},
		jobId: function(hash) {
			//console.log(' hash : ' + hash);
			hash.job = hash.jobId;
			//delete hash.jobId;

			return hash;
		}//,
		// taskTypeId: function(hash) {
		// 	//console.log(' hash : ' + hash);
		// 	hash.taskType = hash.taskTypeId;
		// 	//delete hash.taskTypeId;

		// 	return hash;
		// }
	}
});
