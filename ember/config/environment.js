/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'true-cron',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['simple-auth'] = {
    authenticationRoute: 'index',
    routeAfterAuthentication: 'dashboard',
    routeIfAlreadyAuthenticated: 'dashboard',
    authorizer: 'simple-auth-authorizer:oauth2-bearer',
    crossOriginWhitelist: ['http://dev.truecron.com:3000']
  }

  ENV['torii'] = {
    providers: {
      'google-oauth2': {
        apiKey: 'AIzaSyDeLid5HCkg5-dT3R4vUN0Bx59Jt4v04Ak',
        scope: 'profile email',
        redirectUri: 'http://localhost:4200'
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
    
    ENV['simple-auth-oauth2'] = {
      serverTokenEndpoint: 'http://dev.truecron.com:3000/oauth/token'
    }

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "'self' data: use.typekit.net",
      'connect-src': "'self' dev.truecron.com:3000",
      'img-src': "'self' www.facebook.com p.typekit.net data:",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'auto';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
