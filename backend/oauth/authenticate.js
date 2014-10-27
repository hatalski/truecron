//
// Middleware that extracts bearer tokens issued by OAuth2 server, validates them, and sets req.userId and req.clientId.
// If the token is invalid, the request fails with 401 error.
//
var token = require('./token');
module.exports = token.verify;
