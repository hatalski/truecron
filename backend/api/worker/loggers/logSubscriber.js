/**
 * Created by estet on 11/30/14.
 */
async = require("async");

Array.prototype.send = function(message)
{
    if(typeof message != 'string' && !(message instanceof String))
    {
        message = JSON.stringify(message);
    }

    async.each(this,
        function(subs){
            subs.send(message);
        }
    );
};

Array.prototype.stop = function(callback)
{
    async.each(this,
        function(subs,done){
            subs.stop(done);
        },
        function(err){
            if (callback && typeof callback === 'function')
                callback(err);
        }
    );
};

var LogSubscriber = function()
{
    this.init();
};

LogSubscriber.prototype.init = function()
{
    this.outPut = [];
};

LogSubscriber.prototype.send = function(message) {
    throw new Error('LogDispatcher needs to have method send() defined.');
};

LogSubscriber.prototype.stop = function(callback) {
    throw new Error('LogDispatcher needs to have method stop() defined.');
};

module.exports = LogSubscriber;