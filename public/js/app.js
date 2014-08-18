App = Ember.Application.create({
    /*ready: function() {
        alert('Yes!');
    }*/
});

App.Router.map(function() {
    this.route('hello');
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return [];
  }
});

App.HelloRoute = Ember.Route.extend({
  model: function() {
    return [
        'Hello from Paul',
        'Hello from Natallia',
        'Hello from Dmitry',
        'Hello From Viny',
        'Hello world from Andrei!',
        'Hi from Lev!',
        'Hello from Vitalik!',
        'Hello from Vitali!'
    ];
  }
});