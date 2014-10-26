/**
 * Created by estet on 10/26/14.
 */
var taskRunner = new function()
{
    this.run = function(task)
    {
        //implement basic logic here
        task.run();
    };
};

module.exports = taskRunner;