#!/usr/bin/env node

console.log('dirname', __dirname);

var https = require('https');
var http = require('http');
var fs = require('fs');
var log = require('./server/lib/logger');
var app = require('./server/app');
var config = require('./server/lib/config');

var server = http.createServer(app).listen(config.get('PORT'), function() {
	log.info('Express http server listening on port ' + this.address().port);
});

//var certExists = fs.existsSync(config.get('CERTIFICATE_PATH'));
//log.info(config.get('CERTIFICATE_PATH') + ' : ' + certExists);

//var options = {
//	key: fs.readFileSync(config.get('PRIVATE_KEY_PATH')),
//	cert: fs.readFileSync(config.get('CERTIFICATE_PATH'))
//};
//var secureServer = https.createServer(options, app).listen(config.get('SECURE_PORT'), function() {
//	log.info('Express https server listening on port ' + this.address().port);
//});

var io = require('socket.io')(server);
var redis = require('socket.io-redis');

io.adapter(redis({ host: config.get('REDIS_HOST'), port: config.get('REDIS_PORT') }));

io.on('connection', function(socket) {
    log.debug('socket.io client has been connected');
    socket.on('disconnect', function(){
        log.debug('socket client disconnected');
    });
    socket.on('ping', function(message) {
        log.debug('ping received', message);
        io.emit('pong');
    });
});

//var sockets = require('./server/lib/sockets');
// app.registerSockets(secureServer);

module.exports = server;