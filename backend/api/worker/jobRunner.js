/**
 * Created by estet on 10/26/14.
 */

var jobRunner = function(job, callBack) {
    if (!job) {
        throw new Exception('Sorry mate, but job is required parameter');
    }

    var executeTask = function (index) {
        if (job.tasks.length > index) {
            var task = job.tasks[index];
            if (task) {
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