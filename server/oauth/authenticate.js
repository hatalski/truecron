//
// Middleware that extracts bearer tokens issued by OAuth2 server, validates them, and sets req.context with authenticated
// user and client IDs.
// If the token is invalid, the request fails with 401 error.
//
var token = require('./token');
module.exports = token.verify;
