var io = require('../../server');
// test
console.dir(io);

//io.on('connection', function(socket) {
//    console.log('socket.io client has been connected');
//    socket.on('disconnect', function(){
//        console.info('socket client disconnected');
//    });
//    socket.on('ping', function() {
//        console.info('ping received');
//        io.emit('pong');
//    });
//});

module.exports = io;