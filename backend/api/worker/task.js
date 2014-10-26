/**
 * Created by estet on 10/23/14.
 */
var logger = require('../../../lib/logger');

var Task = function(name, position, timeout)
{
    this.name = name;
    this.position = position;
    this.active = false;
    this.timeout = timeout;
    this.status = 'waiting';
};

//Task.prototype.run = function()
//{
//    this.status = 'running';
//};
//
//Task.prototype.finish = function()
//{
//    this.status = 'finished';
//};
//
//Task.prototype.stop = function()
//{
//    this.status = 'stopped';
//};

module.exports = Task;
