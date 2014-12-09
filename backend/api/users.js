var express = require('express'),
    _ = require('lodash'),
    logger = require('../../lib/logger'),
    validator = require('../../lib/validator'),
    storage = require('../storage'),
    apiErrors = require('./../../lib/errors'),
    common = require('./common');

var api = express.Router();

function personToUser(person) {
    if (person === undefined) {
        return person;
    }
    var user = person.toJSON();
    var selfUrl = '/users/' + user.id;
    user._links = {
        self: selfUrl,
        organizations: selfUrl + '/organizations',
        history: selfUrl + '/history',
        emails: selfUrl + '/emails'
    };
    delete user.passwordHash;
    return { user: user };
}

function personEmailToEmail(personId, email) {
    if (email === undefined) {
        return email;
    }
    var result = email.toJSON();
    var selfUrl = '/users/' + personId + '/emails/' + email.id;
    result._links = {
        self: selfUrl
    };
    delete result.personId;
    return { email: result };
}

api.route('/users')
    //
    // List of users
    //
    .get(common.parseListParams, function (req, res, next) {

        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { name: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'name';

        storage.Person.findAndCountAll(req.context, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        }).then(function (result) {
                res.json({
                users: result.rows.map(personToUser),
                meta: {
                    total: result.count
                }});
        })
        .catch(function (err) {
            logger.error(err.toString());
            next(err);
        });
    })
    //
    // Create a new user
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.user) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.create(req.context, req.body.user)
        .then(function (person) {
            res.status(201).json(personToUser(person));
        })
        .catch(function (err) {
            logger.error(err.toString());
            return next(err);
        });
    });

//
// :userid can be specified as an integer ID or an email.
//
api.param('userid', function (req, res, next, id) {
    // Allow to specify both ID and email
    if (!validator.isInt(id) && !validator.isEmail(id)&& id!='current') {
        next(new apiErrors.InvalidParams());
    }

    if (id=='current'){
        id=req.context.personId;
    }

    storage.Person.findByIdOrEmail(req.context, id)
        .then(function (person) {
            if (person !== null) {
                req.person = person;
                next();
            } else {
                next(new apiErrors.NotFound());
            }
        })
        .catch(function (err) {
            logger.error(err.toString());
            next(err);
        });
});

api.route('/users/:userid')
    //
    // Get a user
    //
    .get(function (req, res, next) {
        res.json(personToUser(req.person));
    })
    //
    // Update a user
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.user) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.update(req.context, req.person.id, req.body.user)
            .then(function (person) {
                res.json(personToUser(person));
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    })
    //
    // Delete a user
    //
    .delete(function (req, res, next) {
        storage.Person.remove(req.context, req.person.id)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

//
// User emails
//
api.route('/users/:userid/emails')
    //
    // Get email addresses of the user :userid
    //
    .get(common.parseListParams, function (req, res, next) {
        var where = {};
        if (!!req.listParams.searchTerm) {
            where = { email: { like: req.listParams.searchTerm } };
        }
        var sort = req.listParams.sort || 'id';

        storage.Person.getEmails(req.context, req.person.id, {
            where: where,
            order: sort + ' ' + req.listParams.direction,
            limit: req.listParams.limit,
            offset: req.listParams.offset
        })
        .then(function (result) {
            res.json({
                emails: result.rows.map(_.partial(personEmailToEmail, req.person.id)),
                meta: {
                    total: result.count
                }});
        })
        .catch(function (err) {
            logger.error(err.toString());
            next(err);
        });
    })
    //
    // Add a new email address for the user :userid
    //
    .post(function (req, res, next) {
        if (!req.body || !req.body.email) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.addEmail(req.context, req.person.id, req.body.email)
            .then(function (email) {
                res.status(201).json(personEmailToEmail(req.person.id, email));
            })
            .catch(function (err) {
                logger.error(err);
                return next(err);
            });
    });


//
// :email can be specified as an integer ID or as a email.
//
api.param('email', function (req, res, next, id) {
    if (!validator.isInt(id) && !validator.isEmail(id)) {
        return next(new apiErrors.InvalidParams());
    }
    storage.Person.findEmail(req.context, req.person.id, id)
        .then(function (email) {
            if (!!email) {
                req.Email = email;
                next();
            } else {
                next(new apiErrors.NotFound());
            }
        })
        .catch(function (err) {
            logger.error(err.toString());
            next(err);
        });
});


api.route('/users/:userid/emails/:email')
    //
    // Get an email address of the user :userid
    //
    .get(function (req, res, next) {
        res.json(personEmailToEmail(req.person.id, req.Email));
    })
    //
    // Change status of the email address (pending, active)
    //
    .put(function (req, res, next) {
        if (!req.body || !req.body.email || !req.body.email.status) {
            return next(new apiErrors.InvalidParams());
        }
        storage.Person.changeEmailStatus(req.context, req.person.id, req.Email.id, req.body.email.status)
            .then(function (email) {
                res.json(personEmailToEmail(req.person.id, email));
            })
            .catch(function (err) {
                logger.error(err);
                return next(err);
            });
    })
    //
    // Delete the email of the user
    //
    .delete(function (req, res, next) {
        storage.Person.removeEmail(req.context, req.person.id, req.Email.id)
            .then(function () {
                res.status(204).json({});
            })
            .catch(function (err) {
                logger.error(err.toString());
                next(err);
            });
    });

module.exports = api;