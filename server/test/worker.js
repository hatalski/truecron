/**
 * Created by estet on 10/23/14.
 */
var expect     = require('expect.js');
var validator  = require('validator');
var config     = require('../lib/config.js');
var log        = require('../lib/logger.js');
var smtpTask   = require('../worker/smtptask');
var jobRunner  = require('../worker/jobRunner');
var FtpTask    = require('../worker/ftptask');
var ArchiveTask = require('../worker/archivetask');
var S3logger = require('../worker/loggers/s3Log');

var mailTask;

describe('Email task',
    function() {
        it ('has run', function (done) {
            mailTask = new smtpTask('sergey.sokur@truecron.com', 'sergey.sokur@truecron.com', 'subject', 'Text', '<br/>Html<br/>');
            var mailS3Log = new S3logger('_mailS3LogTest');
            mailTask.logSubscribers.push(mailS3Log);
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
            var ftpTask = new FtpTask({host:'catless.ncl.ac.uk', username:'anonymous', password:'@anonymous', protocol: 'ftp'}, 'ls .');
            var ftpS3Log = new S3logger('_ftpS3LogTest');
            ftpTask.logSubscribers.push(ftpS3Log);
            ftpTask.run(function(){
                expect(ftpTask.status).not.to.eql('waiting');
                done();
            });
        });
    });

//describe('Archive task',
//    function()
//    {
//        it('has run', function(done)
//        {
//            var archiveTask = new ArchiveTask(['123.js', 'api.js'], '123.zip', 'zip');
//
//            archiveTask.run(function(){
//                expect(ftpTask.status).not.to.eql('waiting');
//                done();
//            });
//        });
//    });


//describe('SFTP task',
//    function()
//    {
//        it('has run', function(done)
//        {
//            var sFtpTask = new FtpTask({
//                host: 'dev.truecron.com',
//                username: 'vagrant',
//                password: 'vagrant',
//                protocol: 'sftp',
//                port: 22
//            }, ['ls -l']);
//
//            sFtpTask.run(function(){
//                expect(sFtpTask.status).not.to.eql('waiting');
//                done();
//            });
//        });
//    });






