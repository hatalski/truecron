var fs = require('fs');
var log = require('./lib/logger');

var path = process.argv[2];
var certExists = fs.existsSync(path);
log.info(path + ' : ' + certExists);