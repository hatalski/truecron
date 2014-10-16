var redis = require('redis');
var log = require('./logger');
var config = require('./config');

log.info(config.get('NODE_ENV'));
log.info(config.get('REDIS_HOST'));

var client = redis.createClient(
    config.get('REDIS_PORT'),
    config.get('REDIS_HOST'));

if (config.get('REDIS_PASSWORD')) {
    client.auth(config.get('REDIS_PASSWORD'), function () {
        log.info('Redis successfully authenticated!', { address: client.address });
    });
}
else {
    log.info('Redis password has not been specified');
}

client.on("connect", function() {
    log.info('Redis successfully connected!', { address: client.address });
});

client.on("error", function (err) {
    log.info("Redis error occurred", { address: client.address, error: err });
});

process.on('SIGINT', function() {
    client.quit(function (err, res) {
        log.info("Exiting from quit command.", { response: res });
    });
    process.exit(0);
});

module.exports = client;