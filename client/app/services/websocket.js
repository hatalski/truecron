/* global io */

import Ember from 'ember';

export default Ember.Service.extend({
  _setup: function() {
    "use strict";
    let socket = this.socket = io('https://dev.truecron.com/');

    this.subscribers = [];
    socket.on('pong', function (data) {
      if (!this.subscribers) { return; }
      let message = JSON.parse(data);
      this.subscribers.forEach( (callback) => callback(message) );
    }.bind(this));
    socket.emit('ping', 'test');

  }.on('init'),

  sendMessage: function (message) {
    this.socket.emit('ping', message);
  },

  subscribe: function (callback) {
    this.subscribers.pushObject(callback);
  },

  unsubscribe: function (callback) {
    this.subscribers.removeObject(callback);
  }
});
