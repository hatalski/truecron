var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var config = require('./lib/config');
var logger = require('./lib/logger');
var validator = require('./lib/validator');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var auth = require('./routes/auth');
var beta = require('./routes/beta');

var oauth = require('./oauth/index');
var api = require('./api/api');
var storage = require('./storage/index');

var app = express();

// redirect to https if accessing over http
//app.use(function(req, res, next) {
//    if((config.https) && (!req.secure) && (req.protocol !== 'https')) {
//        // For people accessing the instance directly
//        res.redirect('https://' + req.get('Host') + req.url);
//    } else if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
//        // For people accessing instances via an ELB (load balancer)
//        res.redirect('https://' + req.get('Host') + req.url);
//    } else {
//        next();
//    }
//});

app.use(logger.requestLogger);
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator.expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method != "OPTIONS") {
        next();
    } else {
        res.send('OK');
    }
});

app.get('/configs', function(req,res) {
   res.json(
       {
           'NODE_ENV': config.get('NODE_ENV'),
           'IP': config.get('IP'),
           'PORT': config.get('PORT'),
           'SESSION_SECRET': config.get('SESSION_SECRET'),
           'POSTGRE_HOST': config.get('POSTGRE_HOST'),
           'POSTGRE_PORT': config.get('POSTGRE_PORT'),
           'POSTGRE_DATABASE': config.get('POSTGRE_DATABASE'),
           'POSTGRE_USERNAME': config.get('POSTGRE_USERNAME') !== undefined ? config.get('POSTGRE_USERNAME').length : 0,
           'POSTGRE_PASSWORD': config.get('POSTGRE_PASSWORD') !== undefined ? config.get('POSTGRE_PASSWORD').length : 0,
           'REDIS_HOST': config.get('REDIS_HOST'),
           'REDIS_PORT': config.get('REDIS_PORT'),
           'REDIS_PASSWORD': config.get('REDIS_PASSWORD') !== undefined ? config.get('REDIS_PASSWORD').length : 0,
           'AWS_ACCESS_KEY_ID': config.get('AWS_ACCESS_KEY_ID'),
           'AWS_SECRET_ACCESS_KEY': config.get('AWS_SECRET_ACCESS_KEY'),
           'GOOGLE_SSO_CLIENT_ID': config.get('GOOGLE_SSO_CLIENT_ID'),
           'GOOGLE_SSO_CLIENT_SECRET': config.get('GOOGLE_SSO_CLIENT_SECRET'),
           'GOOGLE_SSO_CALLBACK_URL': config.get('GOOGLE_SSO_CALLBACK_URL'),
           'GOOGLE_ANALYTICS_TRACKING_ID': config.get('GOOGLE_ANALYTICS_TRACKING_ID')
       }
   );
});

app.use('/', routes);
app.use('/auth', auth);
app.use('/beta', beta);
app.use('/oauth', oauth.oAuthServer); // OAuth2 server, handles password and "google" authentication
app.use('/api/v1', api); // REST API endpoint

app.use(logger.errorLogger);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

if (app.get('env') === 'development' || app.get('env') === 'codeship') {
    // Pretty print JSON responses
    app.set('json spaces', '  ');

    // development error handler
    // will print stacktrace
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
    console.log(err.message);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//
// Initialize storage
//
storage.initialize()
    .error (function (e) {
        logger.error('Could not initialize storage.');
        throw e;
    });

app.storage = storage;

module.exports = app;