var fs = require('fs');

var path = process.argv[0];
var certExists = fs.existsSync(path);
log.info(path + ' : ' + certExists);