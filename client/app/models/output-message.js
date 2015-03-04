/**
 * Created by estet on 1/27/15.
 */
import DS from 'ember-data';

var outputMessage = DS.Model.extend({
  taskId:       DS.attr(),
  messageType:  DS.attr('string'),
  text:         DS.attr('string')
});

export default outputMessage;
