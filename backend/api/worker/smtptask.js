/**
 * Created by estet on 10/23/14.
 */
var task = require('./task'),
    transporter = require('../../../lib/smtp'),
    util = require('util'),
    logger = require('../../../lib/logger');



var smtpTask = function(from, to, subject, text, html) {
    var self = this;

    self.settings =
    {
        from: from,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    self.run = function(afterSend)
    {
        if(!self.isStarted()) {
            self.start();
            transporter.sendMail(this.settings, function (error, info) {
                if (error) {
                    self.onError(error);
                } else {
                    self.onMessage(info);
                }
                self.afterSend(afterSend);
            });
        }
    };

    self.afterSend = function(afterSend)
    {
        if (afterSend && typeof afterSend === 'function')
            afterSend();

        this.complete();
    };

    self.init();
};

smtpTask.prototype.init = function()
{
    task.super_.prototype.init();
};

util.inherits(smtpTask, task);
module.exports = smtpTask;