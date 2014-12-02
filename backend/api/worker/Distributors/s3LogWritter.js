/**
 * Created by estet on 11/30/14.
 */
var Distributor = require('./distributor');
var util        = require('util');
var config      = require('../../../../lib/config');
var AWS         = require('aws-sdk');

var S3LogWritter = function(filekey)
{
    var self = this;
    S3LogWritter.super_.prototype.init();
    self.messages = [];
    self.fileKey = filekey;
    self.interval = 3000;
    self.stopped = false;
    AWS.config.update({accessKeyId:config.get('AWS_ACCESS_KEY_ID'), secretAccessKey:config.get('AWS_SECRET_ACCESS_KEY')});
    AWS.config.region = 'us-east-1';

    self.s3Bucket = new AWS.S3({params: {Bucket: 'truecron.logs'}});

    self.write = function(message)
    {
        self.messages.push(message);

        if(!self.sendMessages)
        {
            self.sendMessages = function()
            {
                var buffer = new Buffer(self.messages.join("\r\n"), "utf-8");
                self.messages = [];
                var data = {Key: self.fileKey, Body: buffer};
                self.s3Bucket.putObject(data, function (err, data) {
                    if (err) {
                        throw err;
                    }
                });

                self.timerId = setInterval(function()
                {
                    if(!self.stopped)
                    {
                        self.sendMessages();
                    }
                }, self.interval);
            };

            self.sendMessages();
        }
    };

    self.stop = function()
    {
        if (self.timerId) {
            clearInterval(self.timerId);
            self.timerId = null;
        }
        self.stopped = true;
    }
};

util.inherits(S3LogWritter, Distributor);

module.exports = S3LogWritter;