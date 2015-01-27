var superagent = require('superagent'),
    Promise = require('bluebird');

Promise.longStackTraces();

Promise.onPossiblyUnhandledRejection(function(e, promise) {
    throw e;
});

/**
 * Adds a 'Authorization' header with the specified bearer access token.
 * @param accessToken Access token value, received from getAccessToken function.
 * @returns {Request}
 */
superagent.Request.prototype.authenticate = function(accessToken) {
    return this.set('Authorization', 'Bearer ' + accessToken);
};

/**
 * Like Request.end method, but returns a Promise instead.
 * @returns {Promise}
 */
superagent.Request.prototype.endAsync = function() {
    var self = this;
    return new Promise(function(resolve, reject){
        self.end(function(err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

module.exports = superagent;