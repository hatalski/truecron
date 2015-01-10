/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'true-cron',
    environment: environment,
    baseURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      HOST: 'http://localhost:4200',
      SERVER_HOST: 'https://dev.truecron.com',
      API_HOST: 'https://dev.truecron.com/api/v1',
      SIGNUP_HOST: 'https://dev.truecron.com/auth/signup',
      BETA_SIGNUP_HOST: 'https://dev.truecron.com/beta/signup'
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "'self' data: use.typekit.net",
      'connect-src': "'self' dev.truecron.com www.googleapis.com",
      'img-src': "'self' www.facebook.com p.typekit.net data:",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    ENV.APP.SERVER_HOST      = 'https://localhost';
    ENV.APP.API_HOST         = ENV.APP.HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST      = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST = ENV.APP.SERVER_HOST + '/beta/signup';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'staging') {
    ENV.APP.SERVER_HOST      = 'https://staging.truecron.com';
    ENV.APP.API_HOST         = ENV.APP.HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST      = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST = ENV.APP.SERVER_HOST + '/beta/signup';
  }

  if (environment === 'production') {
    ENV.APP.SERVER_HOST      = 'https://www.truecron.com';
    ENV.APP.API_HOST         = ENV.APP.HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST      = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST = ENV.APP.SERVER_HOST + '/beta/signup';
  }

  ENV['simple-auth'] = {
    authenticationRoute: 'index',
    routeAfterAuthentication: 'dashboard',
    routeIfAlreadyAuthenticated: 'dashboard',
    authorizer: 'simple-auth-authorizer:oauth2-bearer',
    crossOriginWhitelist: [ENV.APP.SERVER_HOST]
  }

  ENV['simple-auth-oauth2'] = {
    serverTokenEndpoint: ENV.APP.SERVER_HOST + '/oauth/token'
  }

  ENV['torii'] = {
    sessionServiceName: 'session',
    providers: {
      'google-token': {
        apiKey: '182911798819-t360tlk839gij3m46pgo4noticrqi4s3.apps.googleusercontent.com',
        scope: 'openid profile email',
        redirectUri: ENV.APP.HOST,
        serverSignUpEndpoint: ENV.APP.SIGNUP_HOST,
        profileMethod: 'https://www.googleapis.com/plus/v1/people/me'
      }
    }
  };

  return ENV;
};
