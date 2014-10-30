/**
 * Created by estet on 10/26/14.
 */
var task = require('./task'),
    transporter = require('../../../lib/smtp'),
    util = require('util'),
    logger = require('../../../lib/logger');
var JSFtp = require("jsftp");

var ftpTask = function(ftpConnection, ftpCommands)
{
    var self = this;
    self.ftpConnection = ftpConnection;
    self.settings =
    {
        ftpConnection :ftpConnection,
        ftpTasks : ftpCommands
    };

    self.ftpClient = new JSFtp(ftpConnection);

    self.run = function(callback)
    {
        if(!self.active) {
            self.start();
            var quitFtp = function(callback)
            {
                self.ftpClient.raw('QUIT', function (err, res) {
                    self.afterSend(callback);
                });
            };

            var callFtp = function(index)
            {
                var command = ftpCommands[index];
                if(command) {
                    if(command) {
                        if(Object.prototype.toString.call( command ) !== '[object Array]')
                        {
                            command = [command, null];
                        }
                        try {
                            self.ftpClient[command[0].toLowerCase()](command[1], function (err, res) {
                                self.onError(err);
                                self.onMessage(res);
                                index++;
                                callFtp(index);
                            });
                        }
                        catch(ex)
                        {
                            self.onError(ex);
                            quitFtp(callback);
                        }
                    }
                }
                else
                {
                    quitFtp(callback);
                }
            };
            callFtp(0);
        }
    };

    self.afterSend = function(callback)
    {
        if (callback && typeof callback === 'function')
            callback();
        this.complete();
    };

    self.init();
};

ftpTask.prototype.init = function()
{
    task.super_.prototype.init();
};

util.inherits(ftpTask, task);

module.exports = ftpTask;