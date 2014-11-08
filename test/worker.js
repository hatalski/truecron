/**
 * Created by estet on 10/23/14.
 */
var expect     = require('expect.js');
var validator  = require('validator');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var smtpTask   = require('../backend/api/worker/smtptask');
var jobRunner  = require('../backend/api/worker/jobRunner');
var FtpTask    = require('../backend/api/worker/ftptask');
var FtpConnection = require('../backend/api/worker/ftpConnection');

var mailTask;

describe('Email task',
    function() {
        it ('has run', function (done) {
            mailTask = new smtpTask('sergey.sokur@truecron.com', 'sergey.sokur@truecron.com', 'Test', 'Text', '<b>Html</b>');
            mailTask.run(function(){
                expect(mailTask.status).not.to.eql('waiting');
                done();
            });
        });
    });

describe('FTP task',
    function()
    {
        it('has run', function(done)
        {
            var ftpTask = new FtpTask({host:'ftp.darvision.com', username:'anonymous', password:'@anonymous', protocol: 'ftp'}, 'ls .');

            ftpTask.run(function(){
                expect(ftpTask.status).not.to.eql('waiting');
                done();
            });
        });
    });


describe('SFTP task',
    function()
    {
        it('has run', function(done)
        {
            var sFtpTask = new FtpTask({
                host: 'dev.truecron.com',
                username: 'vagrant',
                password: 'vagrant',
                protocol: 'sftp',
                port: 22
            }, ['ls -l']);

            sFtpTask.run(function(){
                expect(sFtpTask.status).not.to.eql('waiting');
                done();
            });
        });
    });






