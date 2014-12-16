var express = require('express'),
    _ = require('lodash'),
    util = require('util'),
    Promise = require("bluebird"),
    config = require('../lib/config'),
    validator = require('../lib/validator'),
    apiErrors = require('../lib/errors'),
    logger = require('../lib/logger'),
    storage = require('../backend/storage');
    //context = require('../context'),
    //clientAuth = require('./clientauth'),
    //oauthErrors = require('./oautherrors'),
    //token = require('./token');

var router = express.Router();

router.post('/signup', function(req, res, next) {
    // check if there is an incoming parameter email and email is a valid email address
    var email = req.body.email;
    // for some reason validator does not check email length,
    // however according to the specs email cannot be more than 254 char length
    // in our database max length is 256 however
    // http://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
    req.checkBody('email', 'The email address you entered is not valid. Please try again.').isEmail();
    req.checkBody('password', 'The password should be minimum of 8 characters in length.').isLength(8);
    var errors = req.validationErrors();
    if (errors) {
        return next(new apiErrors.InvalidParams(errors));
    }
    //if (!validator.isEmail(email) || email.length > 254) {
    //    next(new apiErrors.InvalidParams('The email address you entered is not valid. Please try again.'));
    //    //res.json(400, { error: { status: 400, message: "The email address you entered is not valid. Please try again." }});
    //    //next();
    //}
    //1. Check if login (email) exists and if exists show message that email is already used in our system
    storage.Person.findByEmail(req.context, email)
    .then(function(result) {
            if (result) {
                return next(new apiErrors.InvalidParams('The email address is already taken. Please choose another one.'));
                //res.json(400, { error: { status: 400, message: "The email address is already taken. Please choose another one." }});
                //next();
            }
            res.status(200).json({ message: "Your account has been created." });
        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });
    //2. Create user account
    //In case of SSO add necessary information to link Google (or other) account with account in our database
    //3. Create "Personal" organization and add user as an admin of this organization
    //Add "My First" workspace and add user as an "editor"
    //4. Send welcome email with email verification code in it
    //5. Authenticate user

});

router.get('/check', function(req, res) {
    if (req.isAuthenticated()) {
            res.json({
                authenticated: true,
                token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', // dv: this is just an example, we should do real authentication
                user: req.user
            })
        } else {
            res.json({
                authenticated: false,
                token: null,
                user: null
            })
        }
});

// dv: simple authentication by hardcoded login and password
router.post('/simple.json', function(req, res) {
    var body = req.body,
        login = body.login,
        password = body.password;
    if (login == 'true' && password == 'cron') {
        res.send({
            success: true,
            token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' // dv: this is just an example, we should do real authentication
        });
    } else {
        res.send({
            success: false,
            message: 'Invalid login/password'
        });
    }
});

router.use(function(err, req, res, next) {
    logger.error(util.inspect(err));
    // Make sure the err has an appropriate status and a message
    err = apiErrors.normalizeError(err);
    res.status(err.status);
    res.json({
        error: {
            status: err.status,
            message: err.message
        }
    });
});

module.exports = router;
