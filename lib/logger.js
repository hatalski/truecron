var logentries = require('node-logentries');
var config = require('./config');
var winston = require('winston');

winston
    .remove(winston.transports.Console)
    .add(winston.transports.Console, { colorize: true, timestamp: true });

if (config.get('LOGENTRIES_TOKEN') != '') {

    winston.info('Integrating with LOGENTRIES using token: ' + config.get('LOGENTRIES_TOKEN'));

    var log = logentries.logger({
        token: config.get('LOGENTRIES_TOKEN')
    });
    log.winston( winston );

    // display logentries errors in console.
    log.on('error', function(err) {
        console.log('logentries error: ' + err);
    });
}

module.exports = winston;