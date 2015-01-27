#!/usr/bin/env node
var https = require('https');
var http = require('http');
var fs = require('fs');
var log = require('./lib/logger');
var app = require('./app');
var config = require('./lib/config');

http.createServer(app).listen(config.get('PORT'), function() {
	log.info('Express http server listening on port ' + this.address().port);
});
var options = {
	key: fs.readFileSync(config.get('PRIVATE_KEY_PATH')),
	cert: fs.readFileSync(config.get('CERTIFICATE_PATH'))
};
https.createServer(options, app).listen(config.get('SECURE_PORT'), function() {
	log.info('Express http server listening on port ' + this.address().port);
});