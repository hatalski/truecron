var redis = require('socket.io-redis');

var httpsServer = require('../../server');
var logger = require('./logger');
var config = require('./config');

var io = require('socket.io')(httpsServer);
io.adapter(redis({ host: config.get('REDIS_HOST'), port: config.get('REDIS_PORT') }));
logger.info('socket.io started');
io.on('connection', function(socket) {
    logger.info('socket client connected');
    socket.on('disconnect', function(){
        logger.info('socket client disconnected');
    });
    socket.on('ping', function(){
        logger.info('ping received');
        socket.emit('pong');
    });
});

module.exports = io;