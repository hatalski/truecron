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

var Task = function(name, position, timeout, distibutors)
{
    this.name = name;
    this.position = position;
    this.timeout = timeout;
    this.distibutors = distibutors;
    this.init();
};

Task.prototype.init = function()
{
    this.status = taskStatusEnum.waiting;
};

Task.prototype.onError = function(error)
{
    if(error) {
        var errorText = 'Sorry ' + error;
        logger.error(errorText);
        this.distibutors.send(errorText);
    }
};

Task.prototype.onMessage = function(message)
{
    if(message) {
        var messageText = 'Message sent: ' + JSON.stringify(message);
        logger.info(messageText);
        this.distibutors.send(message);
    }
};

Task.prototype.start = function()
{
    this.onMessage('Started');
    this.status = taskStatusEnum.started;
};

Task.prototype.isStarted = function()
{
    return this.status == taskStatusEnum.started;
};

Task.prototype.onComplete = function(callBack)
{
    this.status = taskStatusEnum.completed;
    this.onMessage('Completed');

    if (callBack && typeof callBack === 'function')
        callBack();
};

Task.prototype.run = function() {
    throw new Error('Task needs to have run() defined.');
};

module.exports = Task;
