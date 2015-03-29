/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'true-cron',
    podModulePrefix: 'true-cron/pods',
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
      HOST:               'http://localhost:4200',
      SERVER_HOST:        'https://dev.truecron.com',
      API_HOST:           'https://dev.truecron.com/api/v1',
      SIGNUP_HOST:        'https://dev.truecron.com/auth/signup',
      BETA_SIGNUP_HOST:   'https://dev.truecron.com/beta/signup',
      RESET_PASSWORD_HOST:'https://dev.truecron.com/auth/resetpassword',
      GOOGLE_API_KEY:     '182911798819-t360tlk839gij3m46pgo4noticrqi4s3.apps.googleusercontent.com',
      HIDE_SIGNUP:        false
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV.APP.SERVER_HOST      = 'https://dev.truecron.com';
    ENV.APP.API_HOST         = ENV.APP.SERVER_HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST      = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST = ENV.APP.SERVER_HOST + '/beta/signup';
    ENV.RESET_PASSWORD_HOST  = ENV.APP.SERVER_HOST + '/auth/resetpassword';

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "'self' data: use.typekit.net https://fonts.gstatic.com",
      'connect-src': "'self' https://192.168.3.10 wss://192.168.3.10/ https://dev.truecron.com wss://dev.truecron.com/ www.googleapis.com",
      'img-src': "'self' www.gravatar.com www.facebook.com p.typekit.net data:",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    ENV.APP.SERVER_HOST      = 'https://localhost';
    ENV.APP.API_HOST         = ENV.APP.SERVER_HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST      = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST = ENV.APP.SERVER_HOST + '/beta/signup';
    ENV.RESET_PASSWORD_HOST  = ENV.APP.SERVER_HOST + '/auth/resetpassword';
    ENV.APP.GOOGLE_API_KEY   = '411638818068-g7l3kh9pifo0jbsauepb5sa9tt855a0s.apps.googleusercontent.com';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'staging') {
    ENV.APP.HOST                 = 'https://appstaging.truecron.com';
    ENV.APP.SERVER_HOST          = 'https://staging.truecron.com';
    ENV.APP.API_HOST             = ENV.APP.SERVER_HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST          = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST     = ENV.APP.SERVER_HOST + '/beta/signup';
    ENV.APP.RESET_PASSWORD_HOST  = ENV.APP.SERVER_HOST + '/auth/resetpassword';
    ENV.APP.GOOGLE_API_KEY       = '640877791996-juctck3aimf9f2i99vf3aa3lo9597dbq.apps.googleusercontent.com';

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "'self' data: use.typekit.net https://fonts.gstatic.com",
      'connect-src': "'self' https://staging.truecron.com ws://staging.truecron.com wss://staging.truecron.com www.googleapis.com",
      'img-src': "'self' www.gravatar.com www.facebook.com p.typekit.net data:",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    }
  }
  if (environment === 'production') {
    ENV.APP.HOST                = 'https://app.truecron.com';
    ENV.APP.SERVER_HOST         = 'https://www.truecron.com';
    ENV.APP.API_HOST            = ENV.APP.SERVER_HOST + '/api/v1';
    ENV.APP.SIGNUP_HOST         = ENV.APP.SERVER_HOST + '/auth/signup';
    ENV.APP.BETA_SIGNUP_HOST    = ENV.APP.SERVER_HOST + '/beta/signup';
    ENV.APP.RESET_PASSWORD_HOST = ENV.APP.SERVER_HOST + '/auth/resetpassword';
    ENV.APP.GOOGLE_API_KEY      = '584720647348-sfa16c6nriakjntd90qh05togeigs6co.apps.googleusercontent.com';
    ENV.APP.HIDE_SIGNUP         = true;

    ENV.contentSecurityPolicy = {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' use.typekit.net connect.facebook.net maps.googleapis.com maps.gstatic.com",
      'font-src': "'self' data: use.typekit.net http://fonts.gstatic.com",
      'connect-src': "'self' https://www.truecron.com ws://www.truecron.com wss://www.truecron.com www.googleapis.com",
      'img-src': "'self' www.gravatar.com www.facebook.com p.typekit.net data:",
      'style-src': "'self' 'unsafe-inline' use.typekit.net",
      'frame-src': "s-static.ak.facebook.com static.ak.facebook.com www.facebook.com"
    }
  }

  ENV['simple-auth'] = {
    authenticationRoute: 'signin',
    routeAfterAuthentication: 'workspaces',
    routeIfAlreadyAuthenticated: 'workspaces',
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
        apiKey: ENV.APP.GOOGLE_API_KEY,
        scope: 'openid profile email',
        redirectUri: ENV.APP.HOST,
        serverSignUpEndpoint: ENV.APP.SIGNUP_HOST,
        profileMethod: 'https://www.googleapis.com/plus/v1/people/me'
      }
    }
  }
  return ENV;
};
