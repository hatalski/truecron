var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../lib/logger'),
    validator = require('../lib/validator'),
    errors = require('../lib/errors'),
    tools = require('./tools'),
    workspaceAccess = require('./workspace-access');

var using = Promise.using;


/**
 * Create a new code for reset password.
 */

var create = module.exports.create = Promise.method(function (context, attributes) {
    if (!attributes.email) {
        throw new errors.InvalidParams('email is not specified.');
    }
    if (!attributes.resetpasswordcode) {
        throw new errors.InvalidParams('resetpasswordcode is not specified.');
    }

    var locals = { attrs: attributes };

    return using (models.transaction(), function (tx) {
                return models.ResetPassword.create(locals.attrs, { transaction: tx });
    })
        .catch(function (err) {
            logger.error('Failed to create new entry ResetPassword, %s.', err.toString());
            throw err;
        });
});


/**
 * Search a code.
 */
var findByCode = module.exports.findByCode = Promise.method(function (context, code, transaction) {
    return models.ResetPassword.find({ where: { resetpasswordcode: code } }, { transaction: transaction })
        .then(function (resetpass) {
            return resetpass;
        })
        .then(function (resetpass) {
            if (resetpass === null) {
                return null;
            }
            return resetpass;
        })
        .catch(function (err) {
            logger.error('Failed to find a resetpass %s, %s.', code, err.toString());
            throw err;
        });
});


var findByEmail = module.exports.findByEmail = Promise.method(function (context, email, transaction) {
        return models.ResetPassword.find({ where: { email: email, resetpasswordcode: context.resetpasswordcode } }, { transaction: transaction })
            .then(function (resetpass) {
                return resetpass;
            })
        .then(function (resetpass) {
            if (resetpass === null) {
                return null;
            }
            return resetpass;
        })
        .catch(function (err) {
            logger.error('Failed to find a email or resetpass %s, %s.', email, err.toString());
            throw err;
        });
});

/**
 * Remove a code.
 */
var remove = module.exports.remove = Promise.method(function (context, codeForResetPass) {
    return models.ResetPassword.destroy({ where: { resetpasswordcode: codeForResetPass } })
        .catch(function (err) {
            logger.error('Failed to remove the code for reset password %d, %s.', codeForResetPass, err.toString());
            throw err;
        });

});



