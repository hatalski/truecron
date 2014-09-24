var nconf = require('nconf');

nconf.argv()
    .env();

nconf.defaults({
    'NODE_ENV': process.env.NODE_ENV || 'development',
    'IP': process.env.IP || '127.0.0.1',
    'PORT': process.env.PORT || 3000,
    'SESSION_SECRET': process.env.SESSION_SECRET || 'truecron-Hhe34Jls0J04',
    'POSTGRE_HOST': process.env.POSTGRE_HOST || '192.168.3.20',
    'POSTGRE_PORT': process.env.POSTGRE_PORT || 5432,
    'POSTGRE_DATABASE': process.env.POSTGRE_DATABASE || 'vagrant',
    'POSTGRE_USERNAME': process.env.POSTGRE_USERNAME || 'vagrant',
    'POSTGRE_PASSWORD': process.env.POSTGRE_PASSWORD || 'vagrant',
    'REDIS_HOST': process.env.REDIS_HOST || 'localhost',
    'REDIS_PORT': process.env.REDIS_PORT || 6379,
    'REDIS_PASSWORD': process.env.REDIS_PASSWORD,
    'AWS_ACCESS_KEY_ID': process.env.AWS_ACCESS_KEY_ID || '',
    'AWS_SECRET_ACCESS_KEY': process.env.AWS_SECRET_ACCESS_KEY || '',
    'GOOGLE_SSO_CLIENT_ID': process.env.GOOGLE_SSO_CLIENT_ID || '120337618420-mnnrjk2734k1btjmu50h92a6kuj0juq8.apps.googleusercontent.com',
    'GOOGLE_SSO_CLIENT_SECRET': process.env.GOOGLE_SSO_CLIENT_SECRET || 'kM946eyWgYNSz-I9tqU5tDtn',
    'GOOGLE_SSO_CALLBACK_URL': process.env.GOOGLE_SSO_CALLBACK_URL || 'http://192.168.3.10:3000/auth/google/callback',
    'GOOGLE_ANALYTICS_TRACKING_ID': process.env.GOOGLE_ANALYTICS_TRACKING_ID || ''
});

module.exports = nconf;