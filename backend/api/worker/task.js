/**
 * Created by estet on 10/23/14.
 */
var logger = require('../../../lib/logger');

var taskStatusEnum =
{
    waiting   : 'waiting',
    started   : 'started',
    completed : 'completed'
};

var Task = function(name, position, timeout)
{
    this.name = name;
    this.position = position;
    this.timeout = timeout;
    this.init();
};

Task.prototype.init = function()
{
    this.status = taskStatusEnum.waiting;
    this.outPut = [];
};

Task.prototype.onError = function(error)
{
    var errorText = 'Sorry ' + error;
    logger.error(errorText);
    this.outPut.push(errorText);
};

Task.prototype.onMessage = function(message)
{
    var messageText = 'Message sent: ' + JSON.stringify(message);
    logger.info(messageText);
    this.outPut.push(messageText);
};

Task.prototype.start = function()
{
    this.status = taskStatusEnum.started;
};

Task.prototype.isStarted = function()
{
    return this.status == taskStatusEnum.started;
};

Task.prototype.complete = function()
{
    this.status = taskStatusEnum.completed;
};

module.exports = Task;
