/* global swal */

import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        addOrganization: function(newOrganizationName) {
            "use strict";
            Ember.Logger.log('Organization should be added now.', newOrganizationName);
            var organization = this.store.createRecord('organization', {
                name: newOrganizationName
            });
            organization.save().then(function(newOrg) {
                swal("Nice!", "Organization has been created with a name: " + newOrg.get('name'), "success");
            });
        },
        addWorkspace: function(newWorkspaceName, organization) {
            "use strict";
            Ember.Logger.log('Workspace should be added now.', newWorkspaceName);
            var workspace = this.store.createRecord('workspace', {
                name: newWorkspaceName,
                organization: organization
            });
            workspace.save().then(function(newWsp) {
                swal("Nice!", "Workspace has been created with a name: " + newWsp.get('name'), "success");
            });
        }
    }
});
