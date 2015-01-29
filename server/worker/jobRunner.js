/**
 * Created by estet on 10/26/14.
 */
var S3Log = require('./loggers/s3Log');


var jobRunner = function(job, callBack, logger) {
    if (!job) {
        throw new Exception('Sorry mate, but job is required parameter');
    }

    if (typeof callBack !== 'function') {
        logger = callBack;
    }

    logger = logger || new S3Log(job.id);

    var executeTask = function (index) {
        if (job.tasks.length > index) {
            var task = job.tasks[index];
            if (task) {
                if(logger) {
                    task.logSubscribers.push(logger);
                }
                task.run(executeTask(index + 1));//on call back running next task in order
            }
        }
        else {
            if (typeof callBack === 'function') {
                callBack();
            }
        }
    };

    if (job.tasks) {

        executeTask(0);//Executing first task.
    }
};

module.exports = jobRunner;