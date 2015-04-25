var mongoose = require('mongoose');
var log = require('./logger');
var config = require('./config');

log.info('connecting to mongodb', { url: config.get('MONGODB_URL') });
mongoose.connect(config.get('MONGODB_URL'));

mongoose.connection.on('connected', function() {
    log.info('Mongoose connected to ', { url: config.get('MONGODB_URL') });
});

mongoose.connection.on('error', function(error) {
    log.error('Mongoose connection error: ', { error: error });
});

mongoose.connection.on('disconnected', function() {
    log.info('Mongoose disconnected.');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
        log.info('Mongoose disconnected through app termination.');
        process.exit(0);
    });
});