'use strict';

App.Organization = DS.Model.extend({
//    id: DS.attr('int'), // vdm: NB: don't add id as it cause f...ing error!!!
    name: DS.attr('string'),
    email: DS.attr('string')
});

App.Organization.FIXTURES = [
    { id: 1, name: "Personal organization", email: "example@truecron.com" },
    { id: 2, name: "Test organization", email: "example@truecron.com" }
];


App.Router.map(function() {
    this.resource('organizations', function() {
        this.route('add');
        this.resource('organizations.item', { path: ':id' });
    });
});

App.OrganizationsIndexRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return this.store.findAll('organization');
    }
});

App.OrganizationsAddRoute = App.AuthenticatedRoute.extend({
});

App.OrganizationsItemRoute = App.AuthenticatedRoute.extend({
    model: function(params) {
        return this.store.find('organization', params.id);
    }
});
