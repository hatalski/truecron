var winston = require('winston');

winston
    .remove(winston.transports.Console)
    .add(winston.transports.Console, { colorize: true, timestamp: true });

module.exports = winston;