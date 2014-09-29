var organizations = [
    { id: 1, name: "Personal organization", email: "example@truecron.com"},
    { id: 2, name: "Test organization", email: "example@truecron.com"}
];


App.Router.map(function() {
    this.resource('organizations', function() {
        this.resource('organizations-item', { path: ':id' });
    });
});

App.OrganizationsRoute = App.AuthenticatedRoute.extend({
    model: function () {
        return organizations;
    }
});

App.Router.map(function() {
    this.route('organizations-add');
});

App.OrganizationsAddRoute = App.AuthenticatedRoute.extend({
});

App.OrganizationsItemController = Ember.ObjectController.extend({

});

App.OrganizationsItemRoute = App.AuthenticatedRoute.extend({
    model: function(params) {
        return organizations[params.id]; // dv: TODO: HACK: replace to correct code
    }
});
