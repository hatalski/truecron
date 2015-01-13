#!/usr/bin/env node
var log = require('./lib/logger');
var app = require('./app');
var config = require('./lib/config');

app.set('port', config.get('PORT'));

var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + server.address().port);
});

app.registerSockets(server);