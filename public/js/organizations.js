App.Organization = DS.Model.extend({
    id: DS.attr('int'),
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
        return App.Organization.FIXTURES;
    }
});

App.OrganizationsAddRoute = App.AuthenticatedRoute.extend({
});

App.OrganizationsItemController = Ember.ObjectController.extend({

});

App.OrganizationsItemRoute = App.AuthenticatedRoute.extend({
    model: function(params) {
        return App.Organization.FIXTURES[params.id - 1]; // dv: TODO: HACK: replace to correct code with search in DS
    }
});
