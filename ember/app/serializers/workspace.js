import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	normalizeHash: {
		updatedByUserId: function(hash) {
			console.log(' hash : ' + hash);
			hash.updatedBy = hash.updatedByUserId;
			delete hash.updatedByUserId;

			return hash;
		},
		organizationId: function(hash) {
			hash.organization = hash.organizationId;
			delete hash.organizationId;

			return hash;
		}
	}
});