var organizations = [
    { id: 1, name: "Personal organization", email: "example@truecron.com"},
    { id: 2, name: "Test organization", email: "example@truecron.com"}
];


App.Router.map(function() {
    this.resource('organizations', function() {
        this.route('add');
        this.resource('organizations.item', { path: ':id' });
    });
});

App.OrganizationsRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return organizations;
    }
});

App.OrganizationsAddRoute = App.AuthenticatedRoute.extend({
});

App.OrganizationsItemController = Ember.ObjectController.extend({

});

App.OrganizationsItemRoute = App.AuthenticatedRoute.extend({
    model: function(params) {
        return organizations[params.id - 1]; // dv: TODO: HACK: replace to correct code with search in DS
    }
});
