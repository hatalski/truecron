var superagent = require('superagent');
var expect     = require('expect.js');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var prefix     = config.get('API_HOST') || 'http://localhost:3000/api/v1';

var sslRootCAs = require('ssl-root-cas/latest');
sslRootCAs.inject();

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';