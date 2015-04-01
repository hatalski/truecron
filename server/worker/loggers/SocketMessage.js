/**
 * Created by estet on 2/15/15.
 */

var SocketMessage = function(id, messageType, taskId, text)
{
    var self = this;
    self.Text = text;
    self.MessageType = messageType;
    self.TaskId = taskId;
    self.Id = id;
};

module.exports = SocketMessage;