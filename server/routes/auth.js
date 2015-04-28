var express   = require('express'),
    _         = require('lodash'),
    util      = require('util'),
    Promise   = require('bluebird'),
    config    = require('../lib/config'),
    smtp      = require('../lib/smtp'),
    validator = require('../lib/validator'),
    apiErrors = require('../lib/errors'),
    logger    = require('../lib/logger'),
    storage   = require('../storage'),
    context   = require('../context'),
    random    = require('randomstring');
    crypto    = require('crypto'),
    validity  = 18000000;
    //clientAuth = require('./clientauth'),
    //oauthErrors = require('./oautherrors'),
    //token = require('./token');

var router = express.Router();

router.post('/signup', function(req, res, next) {
    req.context = context.newSystemContext();

    var avatarUrl = (req.body.extensionData &&
                     req.body.extensionData.provider === 'google' &&
                     req.body.extensionData.image &&
                     req.body.extensionData.image.url)
                    ? req.body.extensionData.image.url : undefined;

    req.checkBody('email', 'The email address you entered is not valid. Please try again.').isEmail();
    if (req.body.extensionData && req.body.extensionData.provider === 'google') {
        req.body.password = '007';
        req.checkBody('password', 'The standard password for google sign up should be minimum of 3 characters in length.').isLength(3);
    } else {
        req.checkBody('password', 'The password should be minimum of 8 characters in length.').isLength(8);
    }
    var email = req.body.email;
    var extensionData = req.body.extensionData;
    var shouldSendEmail = req.body.sendEmail === undefined;
    var password = req.body.password;

    var errors = req.validationErrors();
    if (errors) return next(new apiErrors.InvalidParams(errors));

    var response = { organization: null, user: null, workspace: null };

    storage.Person.findByEmail(req.context, email)
        .then(function(result) {
            // 1. Check if login (email) exists and if exists show message that email is already in use.
            if (result) {
                // 1.1 or if it is a google sign in / up then update google profile
                if (req.body.extensionData && req.body.extensionData.provider === 'google') {
                    var attributes = { extensionData: req.body.extensionData };
                    storage.Person.update(req.context, result.id, attributes)
                        .then(function(person) {
                            res.status(200).json(person);
                        });
                } else {
                    var err = new apiErrors.InvalidParams('The email address is already taken. Please choose another one.');
                    logger.error(err.toString());
                    return next(err);
                }
            } else {
                // 2. Create user account
                var attributes = { name: req.body.name || email, password: password, extensionData: extensionData, avatarUrl: avatarUrl };
                storage.Person.create(req.context, attributes)
                    .then(function (person) {
                        if (!person) logger.error('person has not been created');
                        response.user = person;
                        req.context.personId = person.id;
                        // 2.1 Add email
                        return storage.Person.addEmail(req.context, person.id, { email: email, status: 'active' });
                    })
                    .then(function (addedEmail) {
                        // 3. Create "Personal" organization and add user as an admin of this organization
                        return storage.Organization.create(req.context, { name: 'Personal', email: email });
                    })
                    .then(function (org) {
                        if (!org) logger.error('organization has not been created');
                        response.organization = org;
                        // 3.1 Add "My First" workspace and add user as an "editor"
                        var newWorkspaceAttributes = { name: 'My First', organizationId: org.id };
                        return storage.Workspace.create(req.context, newWorkspaceAttributes);
                    })
                    .then(function(wsp) {
                        if (!wsp) logger.error('workspace has not been created');
                        response.workspace = wsp;
                        // 4. Send welcome email with email verification code in it
                        if (shouldSendEmail) {
                            return smtp.sendMail({
                                from: 'welcome@truecron.com',
                                to: email,
                                subject: 'Welcome to TrueCron!',
                                html: 'Welcome to TrueCron and thanks for signing up!<br/><br/><hr/><br/>' +
                                '<b>Sign in to your account:</b><br/>' +
                                'https://truecron.com<br/><br/>' +
                                '<b>User name:</b><br/>' + email + '<br/><br/><hr/><br/>' +
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
            }
        });
});

router.post('/cancelaccount', function(req, res, next) {
    var email = req.body.email;

    req.checkBody('email', 'The email address you entered is not valid. Please try again.').isEmail();
    var errors = req.validationErrors();
    if (errors) return next(new apiErrors.InvalidParams(errors));

    req.context = context.newSystemContext();

    var response = { user: null, workspace: null };
    storage.Person.findByEmail(req.context, email)
        .then(function(person) {
            if (!person) {
                console.log('no person found for this email: ' + email);
                return;
            } else {
                response.user = person;
                // console.dir(person);
                req.context.personId = person.id;
                return storage.Person.removeEmail(req.context, person.id, email);
            }
        })
        .then(function(removedEmail) {
            // console.log('removed email: ');
            // console.dir(removedEmail);
            return storage.Workspace.find(req.context, { name: 'My First' });
        })
        .then(function(wsp) {
            response.workspace = wsp;
            return storage.Workspace.remove(req.context, wsp.id);
        })
        .then(function(removedWorkspace) {
            return storage.Organization.remove(req.context, response.workspace.organizationId);
        })
        .then(function() {
            return storage.Person.remove(req.context, req.context.personId);
        })
        .then(function() {
            console.dir(response);
            res.status(200).json(response);
        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });

    // 1. Archive all user data and save to S3
    // 1.1 Send S3 link to user by email
    // 2. Remove user's tasks
    // 3. Remove user's jobs
    // 4. Remove user's connections
    // 5. Remove user's workspaces
    // 6. Remove user's organizations
    // 7. Remove user's emails
    // 8. Remove user's history
    // 9. Remove user
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

router.post('/resetpassword', function(req, res, next) {
    var codeToResetPassword = '';
    var email = req.body.resetpass.email;
    var validEmail = validator.isEmail(email);
    var pathForTransition = req.body.env || 'https://dev.truecron.com';
    pathForTransition += '/#/confirmreset';
    codeToResetPassword = crypto.randomBytes(64).toString('base64');
    if (codeToResetPassword.length > 40) {
        codeToResetPassword = codeToResetPassword.slice(codeToResetPassword.length - 40).toString();
        req.body.resetpass.resetpasswordcode = codeToResetPassword;
    }
    if (!validEmail) {
        return next(new apiErrors.InvalidParams('Email is not specified.'));
    }
    if (!codeToResetPassword) {
        return next(new apiErrors.InvalidParams('resetPasswordCode is not specified.'));
    }
    if (validEmail) {
        storage.ResetPasswords.create(req.context, req.body.resetpass)
            .then(function (resetpassw) {
                smtp.sendMail({
                    from: 'welcome@truecron.com',
                    to: email,
                    subject: 'reset password truecron.com',
                    html: 'To reset your password, just click this link:<br/><br/>' +
                    '<a href="' + pathForTransition + '?comde=' + codeToResetPassword + '">' + pathForTransition + '</a> <br/> ' +
                    'or manually enter this code: ' + codeToResetPassword + '<br/> Warning! This code will be valid for 5 hours.' +
                    '<br/><br/>Yours Truly,<br/>' + 'TrueCron Team'
                }, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.status(400).json({message: 'Error: An error occurred while sending mail.'});
                    } else {
                        console.dir(info);
                        console.log('Message sent: ' + info.messageId);
                        res.status(201).json({
                            resetpass: resetpassw,
                            message: 'Email with a code to reset your password has been sent to the specified address'
                        });
                    }
                });

            });
    }
    else {
        res.status(400).json({ message: 'Email not valid!!!'});
    }
});

router.post('/resetpasswordconfirmreset', function(req, res, next) {
    req.context = context.newSystemContext();
    console.log(util.inspect(req.body));
    var codeToResetPassword = req.body.resetpass.resetpasswordcode;
    var isCheckPass = false;
    if (!codeToResetPassword) {
        return next(new apiErrors.InvalidParams('resetPasswordCode is not specified.'));
    }

    storage.ResetPasswords.findByCode(req.context, codeToResetPassword)
        //check the expiration date
        .then(function(resetpass){
            var dateNow = Date.now();
            var createdAtDate = Date.parse(resetpass.createdAt);
            var difference = dateNow-createdAtDate;
            if(difference > validity){
                storage.ResetPasswords.remove(req.context, resetpass.resetpasswordcode);
                return null;
            }
            return resetpass;
        })
        .then(function (resetpassw) {
            var mail = resetpassw.email;
            var validEmail = validator.isEmail(mail);
            if (validEmail) {
                isCheckPass = true;
                storage.Person.findEmail(req.context, false, mail)
                    .then(function (email) {
                        if (email) {
                            req.email = email.dataValues.email;
                        } else {
                            isCheckPass = false;
                            next(new apiErrors.NotFound());
                        }
                    })
            }
            if(isCheckPass) {
                res.status(201).json({resetpass: resetpassw, message: 'Finded'});
            }
            else {
                res.status(400).json({resetpass: resetpassw, message: 'Not Finded'});
            }
        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });
});

router.post('/resetpasswordconfirmnewpassword', function(req, res, next) {
    req.context = context.newSystemContext();
    var codeToResetPassword = req.body.resetpass.resetpasswordcode;
    var newPassword = req.body.resetpass.password;
    if (!codeToResetPassword) {
        return next(new apiErrors.InvalidParams('resetPasswordCode is not specified.'));
    }
    if (!newPassword){
        return next(new apiErrors.InvalidParams('newPassword is not specified.'));
    }
    storage.ResetPasswords.findByCode(req.context, codeToResetPassword)
        .then(function (resetpassw) {
            var mail = resetpassw.email;
            var validEmail = validator.isEmail(mail);
            if (validEmail) {
                storage.Person.findByEmail(req.context, mail)
                    .then(function (person) {
                        if (person) {
                            person.password = newPassword;
                            storage.Person.update(req.context, person.id, person)
                                .then (function (){
                                storage.ResetPasswords.remove(req.context, codeToResetPassword)
                                    .then (function (done){
                                    if (done){
                                        res.status(201).json({resetpass: resetpassw, message: 'Finded'});
                                    }
                                    else {
                                        res.status(400).json({resetpass: resetpassw, message: 'Not Finded'});
                                    }
                                })
                            })
                        } else {
                            next(new apiErrors.NotFound());
                        }
                    })
            }

        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });
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
