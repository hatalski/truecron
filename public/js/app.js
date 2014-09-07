App = Ember.Application.create({
    /*ready: function() {
        alert('Yes!');
    }*/
});

App.AuthenticatedRoute = Ember.Route.extend({
    beforeModel: function(transition) {
        if (!this.controllerFor('signin').get('token')) {
            this.redirectToSignin(transition);
        }
    },
    redirectToSignin: function(transition) {
        // alert('You must sign in!');
        var signinController = this.controllerFor('signin');
        signinController.set('attemptedTransition', transition);
        this.transitionTo('signin');
    },
    getJsonWithToken: function(url) {
        var token = this.controllerFor('signin').get('token');
        return $.getJSON(url, { token: token });
    },
    events: {
        error: function(reason, transition) {
            if (reason.status === 401) {
                this.redirectToSignin(transition);
            } else {
                alert('Something went wrong');
            }
        }
    }
});

App.ApplicationRoute = Ember.Route.extend({
    model: function () {
        if (!sessionStorage.token) {
            return $.get("/auth/check").then(function (response) {
                if (response.token) {
                    sessionStorage.token = response.token;
                }
                return null;
                //return {user: response.user};
            })
        }
    },
    afterModel: function(data, transition) {
        // dv: dirty hack, will fix it
        if (sessionStorage.token) {
            this.controllerFor('signin').set('token', sessionStorage.token);
            this.controllerFor('signin').set('isSignedIn', true);
        }
    }
});

App.ApplicationController = Ember.Controller.extend({
    needs: ['signin']
});

App.IndexController = Ember.Controller.extend({
    needs: ['signin']
});

// Controllers
App.SigninController = Ember.Controller.extend({
    reset: function() {
        this.setProperties({
            login: "",
            password: "",
            errorMessage: ""
        });
    },
    token: sessionStorage.token,
    tokenChanged: function() {
        sessionStorage.token = this.get('token');
    }.observes('token'),

    signin: function() {
        var self = this, data = this.getProperties('login', 'password');

        // Clear out any error messages.
        this.set('errorMessage', null);
        $.post('/auth/simple.json', data).then(function(response) {
            self.set('errorMessage', response.message);
            self.set('isSignedIn', response.success ? true : false);
            if (response.success) {
                self.set('token', response.token);

                var attemptedTransition = self.get('attemptedTransition');
                if (attemptedTransition) {
                    attemptedTransition.retry();
                    self.set('attemptedTransition', null);
                } else {
                    // Redirect to 'index' by default.
                    self.transitionToRoute('index');
                }
            } else {
                self.set('token', "");
            }
        });
    },
    signout: function() {
        var self = this;

        self.set('isSignedIn', false);
        self.set('token', "");
    }
});

// add route "signin" "signup"
App.Router.map(function() {
    this.route('signin');
    this.route('signup');
});

App.SigninRoute = Ember.Route.extend({
    setupController: function(controller, context) {
        controller.reset();
    }
});

App.Router.map(function() {
    this.route('dashboard');
});

// dv: hello available only for signed in user
App.Router.map(function() {
    this.route('hello');
});

App.HelloRoute = App.AuthenticatedRoute.extend({
    model: function() {
        return this.getJsonWithToken('/hello.json');
    }
});