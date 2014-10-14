var Promise = require("bluebird"),
    bcrypt = Promise.promisifyAll(require('bcryptjs'));

module.exports.hashPassword = Promise.method(function (password) {
    password = password || '';
    return bcrypt.hashAsync(password);
});

module.exports.comparePasswordAndHash = Promise.method(function (password, passwordHash) {
    password = password || '';
    return bcrypt.compareAsync(password, passwordHash);
});
