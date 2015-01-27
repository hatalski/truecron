var logentries = require('node-logentries');
var config = require('./config');
var winston = require('winston');
var expressWinston = require('express-winston');

winston
    .remove(winston.transports.Console)
    .add(winston.transports.Console, { colorize: true, timestamp: true, level: 'debug' });

// Use after routers, but before error handlers.
winston.errorLogger = expressWinston.errorLogger({
    winstonInstance: winston
});

// Use before the router.
winston.requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            colorize: true
        })
    ],
    meta: false,     // optional: control whether you want to log the meta data about the request (default to true)
    expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
    colorStatus: true
});

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