/**
 * Created by estet on 10/26/14.
 */

var jobRunner = new function()
{
    this.runTasks = function(job, callBack)
    {
        if(!job)
        {
            throw new Exception('job is required parameter');
        }

        if(job.tasks) {

            job.tasks.forEach(
                function (index, task) {
                    taskRunner.run(task);
                }
            );
        }
    };
};

module.exports = jobRunner;