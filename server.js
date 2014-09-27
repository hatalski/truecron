#!/usr/bin/env node
var log = require('./lib/logger');
var app = require('./app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  log.info('Express server listening on port ' + server.address().port);
});