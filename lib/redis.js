var redis = require('redis');
var log = require('./logger');
var config = require('./config');

var client = redis.createClient(
    config.get('redis_port'),
    config.get('redis_host'));

if (config.get('redis_password')) {
    client.auth(config.get('redis_password'), function () {
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
    log.error("Redis error occurred", { address: client.address, error: err });
});

process.on('SIGINT', function() {
    client.quit(function (err, res) {
        log.info("Exiting from quit command.", { response: res });
    });
    process.exit(0);
});

module.exports = client;