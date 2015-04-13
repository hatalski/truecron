/**
 * Created by vitalihatalski on 4/9/15.
 */
var io = require('../server');
var logger = require('./lib/logger');

console.log('io', io);
console.log('dirname', __dirname);

io.on('connection', function (socket) {
    console.dir('client connected', socket);
    socket.on('ping', function(message) {
        "use strict";
        logger.log('message recieved: ', message);
    });
    socket.on('pong', function (name, fn) {
        fn('hehe');
    });
});