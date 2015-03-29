/**
 * Created by estet on 10/26/14.
 */
var S3Log = require('./loggers/s3Log');
var FtpTask    = require('./ftptask');

var jobRunner = function(job, callBack, logger) {

    var self = this;
    self.job = job;
    self.callBack = callBack;
    self.logger = logger;

    if (!job) {
        throw new Exception('Sorry mate, but job is required parameter');
    }

    if (typeof self.callBack !== 'function') {
        self.logger = self.callBack;
    }

    self.logger = self.logger || new S3Log(job.id);

    self.executeTask = function (index) {
        if (self.job.tasks.count > index) {

            //var task = new taskWrapper(self.job.tasks.rows[index]);

            var task = new FtpTask({host:'ftp.darvision.com', username:'anonymous', password:'@anonymous', protocol: 'ftp'},
                ['ls .']);

            if (task) {
                if(self.logger) {
                    task.logSubscribers.push(self.logger);
                }
                task.run(self.executeTask(index + 1));//on call back running next task in order
            }
        }
        else {
            if (typeof self.callBack === 'function') {
                self.callBack();
            }
        }
    };

    self.run = function()
    {
        if (self.job.tasks) {

            self.executeTask(0);//Executing first task.
        }
    }

};

module.exports = jobRunner;