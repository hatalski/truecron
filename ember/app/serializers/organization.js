import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	normalizeHash: {
		updatedByUserId: function(hash) {
			console.log(' hash : ' + hash);
			hash.updatedBy = hash.updatedByUserId;
			delete hash.updatedByUserId;

			return hash;
		}
	}
});