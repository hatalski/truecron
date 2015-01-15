/**
 * Created by estet on 1/4/15.
 */
var LogSubscriber = require('./logSubscriber');
var util        = require('util');
var app = require('../../../../app');

var socketLog = function(key)
{
    var self = this;
    self.send = function(message)
    {
        app.io.emit('tco'+key, message);
    };

    self.stop = function(callback)
    {
        if (typeof callback === 'function') {
            callback('Log completed');
        }
    };
};

util.inherits(socketLog, LogSubscriber);

module.exports = socketLog;