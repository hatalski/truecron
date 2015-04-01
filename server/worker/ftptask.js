/**
 * Created by estet on 11/2/14.
 *
 *  IMPORTANT INFORMATION!!!
 *
 *  require to have lftp installed
 *
 *  mac os x: https://code.google.com/p/rudix/downloads/detail?name=lftp-4.0.5-0.dmg&can=2&q=lftp
 *
 *  windows: http://nwgat.ninja/lftp-4-4-10-for-windows/
 *
 */

var task = require('./task'),
    transporter = require('../lib/smtp'),
    util = require('util'),
    logger = require('../lib/logger');
var FTPS = require('ftps');

var SftpTask = function(connection, ftpCommands)
{
    var self = this;

    if(Object.prototype.toString.call( ftpCommands ) !== '[object Array]')
    {
        ftpCommands = [ftpCommands];
    }

    self.settings =
    {
        connection: connection,
        commands: ftpCommands
    };

    self.ftpClient =  new FTPS(self.settings.connection);

    self.run = function(callback)
    {
        if(!self.active) {
            self.start();
            var quitFtp = function(callback)
            {
                self.ftpClient.raw('QUIT').exec(function (err, res) {
                    self.onComplete(callback);
                });
            };

            var callFtp = function(index)
            {
                var command = self.settings.commands[index];

                if(command) {
                    try {
                        self.ftpClient.raw(command).exec(function (err, res) {
                            self.onError(err);
                            self.onError(res['error']);
                            self.onMessage(index + ' ' + res['data']);
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
                else
                {
                    quitFtp(callback);
                }
            };

            callFtp(0);

        }
    };

    self.init();
};

SftpTask.prototype.init = function()
{
    SftpTask.super_.prototype.init();
};

util.inherits(SftpTask, task);

module.exports = SftpTask;