
var express = require('express'),
    _ = require('lodash'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('../lib/errors'),
    common = require('./common');

var api = express.Router();

api.route('/resetpassword')
    //
    // Create a new resetcode
    //
    .post(function (req, res, next){
        if (!req.body || !req.body.email) {
            return next(new apiErrors.InvalidParams('email is not specified.'));
        }
        var resetPasswordCode = req.body.resetpasswordcode;
        if (!resetPasswordCode) {
            return next(new apiErrors.InvalidParams('resetPasswordCode is not specified.'));
        }
        storage.Resetpasswords.create(req.context, req.body)
            .then(function (resetpassw) {
                res.status(201).json({ resetpassw: resetpassw });
            })
    })
    .catch(function (err) {
        logger.error(err.toString());
        return next(err);
    });

api.route('/resetpassword/:resetcode')

    //
    // Get a resetcode
    //
    .get(function (req, res, next) {

    })

    //
    // Delete a resetcode
    //
    .delete(function (req, res, next) {
        storage.Resetpasswords.remove(req.context, req.params.resetcode)
            .then(function () {
                res.status(204).json({});
            })
    });

module.exports = api;