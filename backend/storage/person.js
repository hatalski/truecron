var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    secrets = require('../../lib/secrets'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

var using = Promise.using;

//
// Key strings to identify data in Redis
//

/**
 * Gets the specific person.
 */
var getPersonIdCacheKey = function(personId) {
    return 'person/' + personId;
};

/**
 * Gets an ID of the person by email.
 */
var getPersonIdByEmailCacheKey = function(email) {
    return 'email-to-person/' + email.trim().toLowerCase();
};

/**
 * Gets email addresses of the specific person.
 */
var getEmailsByPersonIdCacheKey = function(personId) {
    return 'person-emails/' + personId;
};

//
// PERSONS
//

/**
 * Search for a single person by ID.
 */
var findById = module.exports.findById = Promise.method(function (id, transaction) {
    return cache.get(getPersonIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.Person.find({ where: { id: id } }, { transaction: transaction })
                .then(function (person) {
                    cache.put(getPersonIdCacheKey(person.id), person);
                    return person;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a person by id %s, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Search for a single person by email.
 */
var findByEmail = module.exports.findByEmail = Promise.method(function (email, transaction) {
    if (!validator.isEmail(email)) {
        return null;
    }
    email = email.trim().toLowerCase();
    return cache.get(getPersonIdByEmailCacheKey(email))
        .then(function (result) {
            if (result.found) {
                return findById(result.value);
            }
            return models.PersonEmail.find({ where: { email: email } }, { transaction: transaction})
                .then(function (personEmail) {
                    if (!!personEmail) {
                        cache.put(getPersonIdByEmailCacheKey(email), personEmail.personId);
                        return findById(personEmail.personId, transaction);
                    }
                    return null;
                });
        })
        .catch(function (err) {
            logger.error('Failed to find a person by email %s, %s.', email, err.toString());
            throw err;
        });
});

/**
 * Search a person by ID or email.
 */
var findByIdOrEmail = module.exports.findByIdOrEmail = Promise.method(function (idOrEmail, transaction) {
    // Allows to specify both ID and email
    if (validator.isInt(idOrEmail)) {
        return findById(idOrEmail, transaction);
    } else if (validator.isEmail(idOrEmail)) {
        return findByEmail(idOrEmail, transaction);
    } else {
        throw new apiErrors.InvalidParams('Invalid person ID or email.');
    }
});

/**
 * Search for a single person.
 * @param {object} options See Sequelize.find docs for details
 */
var find = module.exports.find = Promise.method(function (options, transaction) {
    return models.Person.find(options, { transaction: transaction })
        .then(function (person) {
            if (!!person) {
                cache.put(getPersonIdCacheKey(person.id), person);
            }
            return person;
        })
        .catch(function (err) {
            logger.error('Failed to find a person, %s.', err.toString());
            throw err;
        });
});

/**
 * Return an array of persons matching the query, paged if a limit was specified, and the total number of matching
 * persons.
 * @param {object} options See Sequelize.findAndCountAll docs for details
 * ```
 * {
 *    rows: [ { "person": {...}}, { "person": {...}}, ...],
  *   count: 100
  *}
 * ```
 */
var findAndCountAll = module.exports.findAndCountAll = Promise.method(function (options) {
    return models.Person.findAndCountAll(options)
        .then(function (result) {
            // No need to cache pages of people, but it makes sense to cache individual persons
            result.rows.forEach(function(person) { cache.put(getPersonIdCacheKey(person.id), person); });
            return result;
        })
        .catch(function (err) {
            logger.error('Failed to list persons, %s.', err.toString());
            throw err;
        });
});

/**
 * Compares the specified password with a hash stored in the database for the user.
 * @param {int|string} idOrEmail ID or email of the person.
 * @param {string} password Password to check.
 * @return A promise fulfilled with true if the person is found and the password matches the hash, false otherwise.
 */
var verifyPassword = module.exports.verifyPassword = Promise.method(function (idOrEmail, password) {
    return findByIdOrEmail(idOrEmail)
        .then(function (person) {
            if (person === null || !person.passwordHash) {
                return false;
            }
            return secrets.comparePasswordAndHash(password, person.passwordHash);
        });
});

/**
 * Replace 'password' plain text attribute with 'passwordHash' when a person is modified
 */
var processPassword = Promise.method(function (attributes) {
    if (!attributes.password) {
        return attributes;
    }
    return secrets.hashPassword(attributes.password)
        .then(function (passwordHash) {
            attributes.passwordHash = passwordHash;
            delete attributes.password;
            return attributes;
        });
});

/**
 * Create a new person.
 * @param {object} attributes Initial attributes values. name, password/passwordHash are required.
 * @returns A newly created person.
 */
var create = module.exports.create = Promise.method(function (attributes) {
    if (!attributes || validator.isNull(attributes.name)
        || validator.isNull(attributes.password) && validator.isNull(attributes.passwordHash)) {
        throw new errors.InvalidParams();
    }
    return processPassword(attributes).bind({})
        .then(function (attrs) {
            var self = { attrs: attrs };
            return using (models.transaction(), function (tx) {
                self.tx = tx;
                return models.Person.create(self.attrs, { transaction: tx })
                    .then(function (person) {
                        self.person = person;
                        return history.logCreated(-1, getPersonIdCacheKey(person.id), person, self.tx);
                    })
                    .then(function () {
                        cache.put(getPersonIdCacheKey(self.person.id), self.person);
                        return self.person;
                    });
            });
        })
        .catch(function (err) {
            logger.error('Failed to create a person, %s.', err.toString());
            throw err;
        });
});

/**
 * Update a person.
 * @param {int} id Person ID.
 * @param {object} attributes Updated attributes values.
 * @returns An updated instance.
 */
var update = module.exports.update = Promise.method(function (id, attributes) {
    return processPassword(attributes).bind({})
        .then(function (attrs) {
            var self = { attrs: attrs };
            return using (models.transaction(), function (tx) {
                self.tx = tx;
                return findById(id, tx)
                    .then(function (person) {
                        if (person === null) {
                            throw new errors.NotFound();
                        }
                        self.oldPerson = person;
                        return person.updateAttributes(self.attrs, { transaction: self.tx });
                    })
                    .then(function (person) {
                        self.person = person;
                        return history.logUpdated(-1, getPersonIdCacheKey(person.id), person, self.oldPerson, self.tx);
                    })
                    .then(function () {
                        cache.put(getPersonIdCacheKey(self.person.id), self.person);
                        return self.person;
                    });
            });
        })
        .catch(function (err) {
            logger.error('Failed to update the person %d, %s.', id, err.toString());
            throw err;
        });
});

/**
 * Remove a person.
 * @param {int} id Person ID.
 */
var remove = module.exports.remove = Promise.method(function (id) {
    return using (models.transaction(), function (tx) {
        var self = { tx: tx };
        return findById(id)
            .then(function (person) {
                if (person === null) {
                    // No found, that's ok for remove() operation
                    return;
                }
                self.person = person;
                return person.destroy({transaction: self.tx})
                    .then(function () {
                        return history.logRemoved(-1, getPersonIdCacheKey(self.person.id), self.person, self.tx);
                    })
                    .then(function () {
                        cache.remove(getPersonIdCacheKey(self.person.id),
                            getEmailsByPersonIdCacheKey(self.person.id));
                    });
            });
    })
    .catch(function (err) {
        logger.error('Failed to remove the person %d, %s.', id, err.toString());
        throw err;
    });
});

/**
 * Get person email list.
 * @param {int} personId ID of the person to get emails of.
 * @param {object} options See Sequelize.findAndCountAll docs for details.
 */
var getEmails = module.exports.getEmails = Promise.method(function (personId, options) {
    return cache.get(getEmailsByPersonIdCacheKey(personId))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            options = _.extend({ order: 'id' }, options);
            options.where = _.extend({}, options.where, { personId: personId });
            return models.PersonEmail.findAndCountAll(options)
                .then(function (result) {
                    cache.put(getEmailsByPersonIdCacheKey(personId), result);
                    result.rows.forEach(function(email) { cache.put(getPersonIdByEmailCacheKey(email.email), personId); });
                    return result;
                });
        })
        .catch(function (err) {
            logger.error('Failed to get emails of the person %d, %s.', personId, err.toString());
            throw err;
        });
});

/**
 * Adds an email address for the specified person.
 * @param {int} personId ID of the person.
 * @params {object} A hash with 'email' (required) and 'status' ('active' or 'pending') attributes.
 * ```
 * { email: {
 *    email: "address@domain.com",
 *    status: "pending"
 * }}
 * ```
 * @returns An added instance.
 */
var addEmail = module.exports.addEmail = Promise.method(function (personId, attributes) {
    if (!attributes) {
        throw new errors.InvalidParams('Invalid email');
    }
    var email = attributes.email || '';
    var status = attributes.status || 'pending';
    if (typeof attributes === 'string') {
        email = attributes.trim().toLowerCase();
    }
    if (!validator.isEmail(email)) {
        throw new errors.InvalidParams('Invalid email');
    }
    if (!validator.isIn(status, ['active', 'pending'])) {
        throw new errors.InvalidParams('Invalid status');
    }
    return using (models.transaction(), function (tx) {
        var self = { tx: tx };
        return models.PersonEmail.create({
                personId: personId,
                email: email,
                status: status
            }, {transaction: tx})
            .then(function (result) {
                self.result = result;
                cache.remove(getEmailsByPersonIdCacheKey(personId));
                cache.put(getPersonIdByEmailCacheKey(email), personId);
                return history.log(-1, getPersonIdCacheKey(personId), 'email-add', { email: email, status: status }, {}, self.tx);
            })
            .then(function () {
                return self.result;
            })
            .catch(function (err) {
                logger.error('Failed to add a email for person %d, %s.', personId, err.toString());
                throw err;
            });
    });
});

/**
 * Find a email of the person.
 * @param {int} personId ID of the person to get a email of.
 * @param {string} emailIdOrValue Either a email string or a numberic ID of the email object.
 * @param {object} transaction Optional transaction object if the search shoould be a part of transaction.
 * @returns An instance of email object or null.
 * ```
 * { email: {
 *      id: 1,
 *      createdAt: '2015-01-01T01:01:01Z',
 *      email: 'address@domain.com',
 *      status: 'pending'
 * }
 * ```
 */
var findEmail = module.exports.findEmail = Promise.method(function (personId, emailIdOrValue, transaction) {
    var where = { personId: personId };
    if (validator.isInt(emailIdOrValue)) {
        where.id = emailIdOrValue;
    } else if (validator.isEmail(emailIdOrValue)) {
        where.email = emailIdOrValue;
    } else {
        throw new errors.InvalidParams('Invalid email.');
    }
    return models.PersonEmail.find({ where: where }, { transaction: transaction });
});

var changeEmailStatus = module.exports.changeEmailStatus = Promise.method(function (personId, emailIdOrValue, newStatus) {
    if (!validator.isIn(newStatus, ['active', 'pending'])) {
        throw new errors.InvalidParams('Invalid status');
    }
    return using(models.transaction(), function (tx) {
        var self = { tx: tx };
        return findEmail(personId, emailIdOrValue, self.tx)
            .then(function (email) {
                if (email === null) {
                    throw new errors.NotFound();
                }
                return email.updateAttributes({ status: newStatus }, { transaction: self.tx });
            })
            .then(function (email) {
                self.email = email;
                return history.log(-1, getPersonIdCacheKey(personId), 'email-change-status',
                                    { email: email, status: newStatus }, email, self.tx);
            })
            .then(function () {
                return self.email;
            })
            .catch(function (err) {
                logger.error('Failed to update a status of email %s of the person %d, %s.', emailIdOrValue, personId, err.toString());
                throw err;
            });
    });
});

var removeEmail = module.exports.removeEmail = Promise.method(function (personId, emailIdOrValue) {
    return using(models.transaction(), function (tx) {
        var self = { tx: tx };
        return findEmail(personId, emailIdOrValue, tx)
            .then(function (personEmail) {
                if (personEmail === null) {
                    return; // Ok, nothing to delete
                }
                self.personEmail = personEmail;
                return personEmail.destroy({transaction: self.tx})
                    .then(function () {
                        cache.remove(getEmailsByPersonIdCacheKey(personId), getPersonIdByEmailCacheKey(self.personEmail.email));
                        return history.log(-1, getPersonIdCacheKey(personId), 'email-remove',
                                            {email: self.personEmail.email}, self.personEmail, self.tx);
                    });
            })
            .catch(function (err) {
                logger.error('Failed to remove the email %s from person %d, %s.', emailIdOrValue, personId, err.toString());
                throw err;
            });
    });
});