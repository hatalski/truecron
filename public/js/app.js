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

App.GuestOnlyRoute = Ember.Route.extend({
    beforeModel: function (transition) {
        if (this.controllerFor('signin').get('token')) {
           this.transitionTo('index')
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
    },
    actions: {
        showJobs: function() {
            this.render('interface-tab-jobs', {
                into: 'application',
                outlet: 'navigation'
            });
            this.transitionTo('dashboard')
            return true;
        },
        showConnections: function() {
            this.render('interface-tab-connections', {
                into: 'application',
                outlet: 'navigation'
            });
            this.transitionTo('dashboard')
            return true;
        }
    }
});

App.ApplicationController = Ember.Controller.extend({
    needs: ['signin'],
    actions: {
        addJob: function() {
            this.transitionTo('jobs-add');
        },
        showJobs: function() {
            this.setProperties({'activeTab': 'jobs'});
            return true; // vdm: to pass event handling to parent
        },
        addConnection: function() {
            this.transitionTo('connections');
        },
        showConnections: function() {
            this.setProperties({'activeTab': 'connections'});
            return true; // vdm: to pass event handling to parent
        }
    }
});

App.IndexController = Ember.Controller.extend({
    needs: ['signin']
});

App.IndexRoute = App.AuthenticatedRoute.extend({
    beforeModel: function() {
        this._super();
        if (this.controllerFor('signin').get('token')) {
            this.transitionTo('dashboard');
        }
    }
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

        self.transitionToRoute('index');
    }
});

// Controllers
App.SignupController = Ember.Controller.extend({
    needs: ['signin'],
    reset: function() {
        this.setProperties({
            email: "",
            password: "",
            errorMessage: ""
        });
    },

    signup: function() {
        var self = this, data = this.getProperties('email', 'password');

        // Clear out any error messages.
        this.set('errorMessage', null);
        $.post('/registration/', data).then(function(response) {
            self.set('errorMessage', response.message);
            if (response.success) {
                self.transitionToRoute('index');
            }
        });
    }
});

App.SignupModalController = App.SignupController.extend({

});


// dv: this section is for guest available pages only
App.Router.map(function() {
    this.route('about');
    this.route('terms');
    this.route('plans'); // pricing
    this.route('status'); // service health
});


// dv: 2vm: remove this block please when you complete task https://app.asana.com/0/14979377239417/16371187339761
App.Router.map(function() {
    this.route('home_page');
});

// dv: this section is for signin/signup pages only

// add route "signin" "signup"
App.Router.map(function() {
    this.route('signin');
    this.route('signup');
});

App.SigninRoute = App.GuestOnlyRoute.extend({
    setupController: function(controller, context) {
        controller.reset();
    }
});

App.SignupRoute = App.GuestOnlyRoute.extend({
    setupController: function(controller, context) {
        controller.reset();
    }
});

// dv: this is section is for all other pages (auth protected pages)
App.Router.map(function() {
    this.route('connections');
});

App.ConnectionsRoute = App.AuthenticatedRoute.extend({
    model: function() {
        return this.getJsonWithToken('/connections.json');
    },
    actions: {
        addConnectionFtp: function () {
            this.render('connection-ftp');
            return true;
        },
        addConnectionAgent: function () {
            this.render('connection-agent');
            return true;
        }
    }
});


App.Router.map(function() {
    this.route('jobs');
});

App.JobsRoute = App.AuthenticatedRoute.extend({
});


App.Router.map(function() {
    this.route('jobs-item');
});

App.JobsItemRoute = App.AuthenticatedRoute.extend({
    actions: {
        addTask: function () {
            this.transitionTo('tasks-add');
            return true;
        },
        showTasksItemEmail: function () {
            this.render('tasks-item-email', {
                into: 'jobs-item',
                outlet: 'tasks-item'
            });
            return true;
        }
    }
});


App.Router.map(function() {
    this.route('jobs-add');
});

App.JobsAddRoute = App.AuthenticatedRoute.extend({
    actions: {
        addTask: function () {
            this.transitionTo('tasks-add');
            return true;
        }
    }
});


App.Router.map(function() {
    this.route('tasks-add');
});

App.TasksAddRoute = App.AuthenticatedRoute.extend({
});


App.Router.map(function() {
    this.route('task-ftp');
});

App.TaskFtpRoute = App.AuthenticatedRoute.extend({
});



App.Router.map(function() {
    this.route('dashboard');
});



App.Router.map(function() {
    this.route('execute-bar');
});

// dv: hello available only for signed in user
App.Router.map(function() {
    this.route('hello');
});

// dv: this is just an example how to get data from server for route, countroller, view
App.HelloRoute = App.AuthenticatedRoute.extend({
    model: function() {
        return this.getJsonWithToken('/hello.json');
    }
});