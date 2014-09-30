#!/usr/bin/env node
var debug = require('debug')('TrueCron');
var app = require('./app');

app.set('port', 80);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});