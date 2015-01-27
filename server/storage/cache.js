"use strict";

var Promise = require("bluebird"),
    redis = Promise.promisifyAll(require('redis')),
    config = require('../lib/config'),
    logger = require("../lib/logger");

function Cache() {
    this.initialize();
}

Cache.prototype.initialize = function() {
    var redisOptions = {
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        password: config.get('REDIS_PASSWORD')
    };
    this.redisClient = redis.createClient(redisOptions);
};

Cache.prototype.put = Promise.method(function(key, value) {
    // save value.toJSON() if not null, or null
    return value;
});

Cache.prototype.get = Promise.method(function(key) {
    return {
        key: key,
        found: false,
        value: null
    };
});

Cache.prototype.remove = Promise.method(function(keys) {

});

module.exports = new Cache();
