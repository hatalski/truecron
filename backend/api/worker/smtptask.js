/**
 * Created by estet on 10/23/14.
 */
var task = require('./task'),
    transporter = require('../../../lib/smtp'),
    util = require('util'),
    logger = require('../../../lib/logger');

var smtpTask = function(from, to, subject, text, html)
{
    var self = this;
    self.settings =
    {
        from: from,
        to: to,
        subject : subject,
        text : text,
        html : html
    };

    self.transporter = transporter;
    self.run = function()
    {
        if(!self.active) {
            self.transporter.sendMail(self.settings, function (error, info) {
                if (error) {
                    logger.error('Sorry ' + error);
                } else {
                    logger.info('Message sent: ' + info.response);
                }
            });
        }
    };
};


util.inherits(smtpTask, task);

module.exports = smtpTask;