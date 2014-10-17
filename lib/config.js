var nconf = require('nconf');
var path  = require('path');

var environment = process.env.NODE_ENV || 'development';

nconf.argv()
    .env()
    .file({ file: path.join(__dirname, '../config/' + environment + '.json') });

nconf.defaults({
    'BASE_URL': 'http://dev.truecron.com',
    'IP': process.env.IP || '127.0.0.1',
    'PORT': 80,
    'SESSION_SECRET': 'truecron-Hhe34Jls0J04',
    'POSTGRE_HOST': '192.168.3.20',
    'POSTGRE_PORT': 5432,
    'POSTGRE_DATABASE': 'vagrant',
    'POSTGRE_USERNAME': 'vagrant',
    'POSTGRE_PASSWORD': 'vagrant',
    'REDIS_HOST': 'localhost',
    'REDIS_PORT': 6379,
    'REDIS_PASSWORD': undefined,
    'API_HOST': 'http://dev.truecron.com:3000/api/v1',
    'AWS_ACCESS_KEY_ID': undefined,
    'AWS_SECRET_ACCESS_KEY': undefined,
    'GOOGLE_SSO_CLIENT_ID': '120337618420-mnnrjk2734k1btjmu50h92a6kuj0juq8.apps.googleusercontent.com',
    'GOOGLE_SSO_CLIENT_SECRET': 'kM946eyWgYNSz-I9tqU5tDtn',
    'GOOGLE_SSO_CALLBACK_URL': 'http://dev.truecron.com:3000/auth/google/callback',
    'GOOGLE_ANALYTICS_TRACKING_ID': '',
    'LOGENTRIES_TOKEN': '',
    'BCRYPT_PASSWORD_ROUNDS': 6
});

module.exports = nconf;