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
var ftpTask;

describe('Email task',
    function() {
        it ('has run', function (done) {
            mailTask = new smtpTask('estetik.bel@gmail.com', 'estetik.bel@gmail.com', 'Test', 'Text', '<b>Html</b>>');
            mailTask.run();
            expect(mailTask.status).not.to.eql('waiting');
            done();

        });
    });

describe('Ftp task',
    function()
    {
        it ('has run', function(done)
        {
            ftpTask = new FtpTask(new FtpConnection('ftp.ablecom.net', 'anonymous', 'anonymous'), ['ls', 'ls -l']);
            ftpTask.run();
            expect(ftpTask.status).not.to.eql('waiting');
            done();
        });
    });