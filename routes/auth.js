var express = require('express'),
    _ = require('lodash'),
    util = require('util'),
    Promise = require("bluebird"),
    config = require('../lib/config'),
    smtp = require('../lib/smtp'),
    validator = require('../lib/validator'),
    apiErrors = require('../lib/errors'),
    logger = require('../lib/logger'),
    storage = require('../backend/storage'),
    context = require('../backend/context');
    //clientAuth = require('./clientauth'),
    //oauthErrors = require('./oautherrors'),
    //token = require('./token');

var router = express.Router();

router.post('/signup', function(req, res, next) {
    req.context = context.newSystemContext();

    var email = req.body.email;
    var password = req.body.password;
    var shouldSendEmail = req.body.sendMail === undefined;

    req.checkBody('email', 'The email address you entered is not valid. Please try again.').isEmail();
    req.checkBody('password', 'The password should be minimum of 8 characters in length.').isLength(8);
    var errors = req.validationErrors();
    if (errors) return next(new apiErrors.InvalidParams(errors));

    var response = { organization: null, user: null, workspace: null };

    storage.Person.findByEmail(req.context, email)
        .then(function(result) {
            // 1. Check if login (email) exists and if exists show message that email is already in use.
            if (result) {
                throw new apiErrors.InvalidParams('The email address is already taken. Please choose another one.');
            } else {
                // 2. Create user account
                var attributes = { name: email, password: password};
                return storage.Person.create(req.context, attributes);
            }
        })
        .then(function (person) {
            if (!person) logger.error('person was not created');
            response.user = person;
            req.context.personId = person.id;
            // 2.1 Add email
            return storage.Person.addEmail(req.context, person.id, { email: email, status: 'active' });
        })
        .then(function (addedEmail) {
            console.log('added email');
            console.dir(addedEmail);
            // 3. Create "Personal" organization and add user as an admin of this organization
            return storage.Organization.create(req.context, { name: 'Personal' });
        })
        .then(function (org) {
            if (!org) logger.error('organization was not created');
            response.organization = org;
            // 3.1 Add "My First" workspace and add user as an "editor"
            var newWorkspaceAttributes = { name: 'My First', organizationId: org.id };
            return storage.Workspace.create(req.context, newWorkspaceAttributes);
        })
        .then(function(wsp) {
            if (!wsp) logger.error('workspace was not created');
            response.workspace = wsp;
            // 4. Send welcome email with email verification code in it
            if (shouldSendEmail) {
                return smtp.sendMail({
                    from: 'welcome@truecron.com',
                    to: email,
                    subject: 'Welcome to TrueCron!',
                    html: 'Welcome to TrueCron and thanks for signing up!<hr/>' +
                    '<b>Sign in to your account:</b><br/>' +
                    'https://truecron.com' +
                    '<b>User name:</b><br/>' + email + '<hr/>' +
                    'We hope you enjoy this opportunity to take TrueCron for a spin. Feel free to kick the tires and get acquainted with no limits and no obligation during your free trial.'
                });
            } else {
                return new Promise(function (fulfill){
                    fulfill();
                });
            }
        })
        .then(function() {
            res.status(200).json(response);
        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });
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
