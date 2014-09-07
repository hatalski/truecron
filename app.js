var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');

var exphbs  = require('express-handlebars');

var app = express();

// view engine setup
var hbs = exphbs.create({defaultLayout: 'default'});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(session({
    secret: 'TrueCron',
    resave: true,
    saveUninitialized: true
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    console.log('serializeUser');
    console.log(user);
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    console.log('deserializeUser');
    console.log(user);
    done(null, user);
});

passport.use('google', new GoogleStrategy({
        // dv: TODO: move this code to config
        clientID: '120337618420-mnnrjk2734k1btjmu50h92a6kuj0juq8.apps.googleusercontent.com',
        clientSecret: 'kM946eyWgYNSz-I9tqU5tDtn',
        callbackURL: 'http://dev.truecron.com:3000/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // console.log(profile);
            // To keep the example simple, the user's Google profile is returned to represent the logged-in user
            return done(null, profile);
        });
    }
));

app.get('/auth/google', passport.authenticate('google', { scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]}));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/#/signin' }),
    function(req, res) {
        // dv: TODO: save token to storage
        // console.log(req.user);

        // Successful authentication, redirect home.
        res.redirect('/');
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
