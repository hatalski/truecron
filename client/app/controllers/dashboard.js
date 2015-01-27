import Ember from 'ember';

export default Ember.ObjectController.extend({
	organizations: null,
	choosenOrganization: null,
	choosenWorkspace: null,
	choosen: function() {
		var org = this.get('choosenOrganization.name');
		var wsp = this.get('choosenWorkspace.name');
		if (org == null || wsp == null) {
			return "Choose workspace";
		}
		return this.get('choosenOrganization.name') + ' - ' + this.get('choosenWorkspace.name');
	}.property('choosenOrganization', 'choosenWorkspace'),
	actions: {
		changeWorkspace: function(org, workspace) {
			this.transitionToRoute('dashboard.organization.workspace.jobs', org, workspace);
			this.set('choosenOrganization', org);
			this.set('choosenWorkspace', workspace);
		}
	}
});
