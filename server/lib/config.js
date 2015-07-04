var nconf = require('nconf');
var path  = require('path');

var environment = process.env.NODE_ENV || 'development';

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config/' + environment + '.json') });

nconf.defaults({
    'BASE_URL': 'http://dev.truecron.com:3000',
    'CLIENT_URL': 'http://localhost:4200',
    'IP': process.env.IP || '127.0.0.1',
    'PORT': 80,
    'SECURE_PORT': 443,
    'PRIVATE_KEY_PATH': path.join(__dirname, "../", '/cert/dev/truecron-dev.key'),
    'CERTIFICATE_PATH': path.join(__dirname, "../", '/cert/dev/truecron-dev.crt'),
    'SESSION_SECRET': 'truecron-Hhe34Jls0J04',
    'POSTGRE_HOST': '192.168.3.10',
    'POSTGRE_PORT': 5432,
    'POSTGRE_DATABASE': 'vagrant',
    'POSTGRE_USERNAME': 'vagrant',
    'POSTGRE_PASSWORD': 'vagrant',
    'REDIS_HOST': 'localhost',
    'REDIS_PORT': 6379,
    'REDIS_PASSWORD': undefined,
    'API_HOST': 'http://dev.truecron.com:3000/api/v1',
    'AWS_ACCESS_KEY_ID': 'AKIAI7RMY3PYD6L6RRVA',
    'AWS_SECRET_ACCESS_KEY': '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',
    'SMTP_HOST': 's3-website-eu-west-1.amazonaws.com',
    'SMTP_PORT': 25,
    'SMTP_TLS': true,
    'SMTP_USERNAME': 'AKIAIIBLFETUJYY3L3JA',
    'SMTP_PASSWORD': 'AgwjTtIS03wjIaBM00wKa2ofwNTCVFwNMEfLxHP2MvdO',
    'GOOGLE_SSO_CLIENT_ID': '411638818068-g7l3kh9pifo0jbsauepb5sa9tt855a0s.apps.googleusercontent.com',
    'GOOGLE_SSO_CLIENT_SECRET': 'Ph_X-rEiT97owfe9wjArs7Y4',
    'GOOGLE_SSO_CALLBACK_URL': 'http://dev.truecron.com:3000/auth/google/callback',
    'GOOGLE_ANALYTICS_TRACKING_ID': '',
    'LOGENTRIES_TOKEN': '',
    'BCRYPT_PASSWORD_ROUNDS': 6,
    'OAUTH_SECRET': 'oauthsecret',
    'OAUTH_TOKEN_EXPIRATION_MINUTES': 60
});

module.exports = nconf;