/**
 * Created by estet on 10/26/14.
 */
var task = require('./task'),
    transporter = require('../../../lib/smtp'),
    util = require('util'),
    logger = require('../../../lib/logger'),
    FTPS = require('ftps');

var ftpTask = function(ftpConnection, ftpTasks)
{
    var self = this;
    self.ftpConnection = ftpConnection;
    self.settings =
    {
        ftpConnection : ftpConnection,
        ftpTasks : ftpTasks
    };

    self.ftps = new FTPS(self.settings.ftpConnection);

    self.run = function()
    {
        if(!self.active) {
            self.ftps.exec(ftpTasks, function(error, data)
            {
                if(error)
                {
                    logger.error('Sorry ' + error + ' Data:' + JSON.stringify(data));
                }
                else
                {
                    logger.info('Wow, FTP response: ' + data);
                }
            });
        }
    };

    self.init();
};

ftpTask.prototype.init = function()
{
    task.super_.prototype.init();
};

util.inherits(ftpTask, task);

module.exports = ftpTask;