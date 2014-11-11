import Ember from 'ember';

export default Ember.ObjectController.extend({
	choosenOrganization: null,
	choosenWorkspace: null,
	choosen: function() {
		return this.get('choosenOrganization') + ' - ' + this.get('choosenWorkspace');
	}.property('choosenOrganization', 'choosenWorkspace')
});
