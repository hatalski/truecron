var Promise = require("bluebird"),
    bcrypt = Promise.promisifyAll(require('bcryptjs')),
    config = require('./config');

module.exports.hashPassword = Promise.method(function (password) {
    password = password || '';
    var rounds = config.get('BCRYPT_PASSWORD_ROUNDS');
    return bcrypt.hashAsync(password, rounds);
});

module.exports.comparePasswordAndHash = Promise.method(function (password, passwordHash) {
    password = password || '';
    return bcrypt.compareAsync(password, passwordHash);
});
