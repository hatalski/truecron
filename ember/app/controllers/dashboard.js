import Ember from 'ember';

export default Ember.ObjectController.extend({
	choosenOrganization: null,
	choosenWorkspace: null,
	choosen: function() {
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
