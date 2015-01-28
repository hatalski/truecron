/**
 * Created by estet on 11/30/14.
 */
var LogSubscriber = require('./logSubscriber');
var util        = require('util');
var AWS         = require('aws-sdk');

var S3Log = function(filekey)
{
    var self = this;
    self.messages = [];
    self.fileKey = filekey;
    self.timerId = null;

    var clearTimer = function()
    {
        if(self.timerId)
        {
            clearTimeout(self.timerId);
        }
    };

    self.send = function(message)
    {
        clearTimer();

        self.messages.push(message);
        self.timerId = setTimeout(self.stop, 10000);
    };

    self.stop = function(callback) {
        clearTimer();

        AWS.config.update({
            accessKeyId: 'AKIAJPJNE24NGV2REYAA',
            secretAccessKey: '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',
            region: 'us-east-1'
        });

        var s3Bucket = new AWS.S3({params: {Bucket: 'truecron.logs'}});

        var buffer = new Buffer(self.messages.join('\r\n'), 'utf-8');

        var data = {Key: self.fileKey, Body: buffer};

        s3Bucket.putObject(data, function (err) {
            if (err) {
                callback(err);
            }
            else {
                if (typeof callback === 'function') {
                    callback('Log file ' + self.fileKey + ' has been transferred');
                }
            }
        });
    }
};

util.inherits(S3Log, LogSubscriber);

module.exports = S3Log;