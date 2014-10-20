
var Promise = require("bluebird"),
    _ = require('lodash'),
    models = require('./db/models'),
    cache = require('./cache'),
    history = require('./history'),
    logger = require('../../lib/logger'),
    secrets = require('../../lib/secrets'),
    validator = require('../../lib/validator'),
    errors = require('../../lib/errors');

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
// jobs
//

/**
 * Search for a single jobs by ID.
 */
var findById = module.exports.findById = Promise.method(function (id, transaction) {
    return cache.get(getPersonIdCacheKey(id))
        .then(function (result) {
            if (result.found) {
                return result.value;
            }
            return models.job.find({ where: { id: id } }, { transaction: transaction })
                .then(function (jobs) {
                    cache.put(getPersonIdCacheKey(id), jobs);
                    return jobs;
                });
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
                return module.exports.findById(result.value);
            }
            return models.PersonEmail.find({ where: { email: email } }, { transaction: transaction})
                .then(function (personEmail) {
                    if (!!personEmail) {
                        cache.put(getPersonIdByEmailCacheKey(email), personEmail.personId);
                        return module.exports.findById(personEmail.personId, transaction);
                    }
                    return null;
                });
        });
});

/**
 * Search for a single job.
 * @param {object} options See Sequelize.find docs for details
 */
var find = module.exports.find = Promise.method(function (options, transaction) {
    return models.jobs.find(options, { transaction: transaction })
        .then(function (jobs) {
            if (!!jobs) {
                cache.put(getPersonIdCacheKey(person.id), jobs);
            }
            return jobs;
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
    return models.Job.findAndCountAll(options)
        .then(function (result) {
            // No need to cache pages of people, but it makes sense to cache individual persons
            //result.rows.forEach(function(person) { cache.put(getPersonIdCacheKey(person.id), person); });
            return result;
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
            this.attrs = attrs;
            return models.transaction();
        })
        .then(function (tx) {
            this.tx = tx;
            return models.Person.create(this.attrs, { transaction: tx });
        })
        .then(function (person) {
            this.person = person;
            return history.logCreated(-1, getPersonIdCacheKey(person.Id), person, this.tx);
        })
        .then(function () {
            return this.tx.commit();
        })
        .then(function () {
            cache.put(getPersonIdCacheKey(person.id), this.person);
            return this.person;
        })
        .catch(function(err) {
            logger.error('Failed to create a person, %j.', err);
            if (this.tx) {
                this.tx.rollback();
            }
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
            this.attrs = attrs;
            return models.transaction();
        })
        .then(function (tx) {
            this.tx = tx;
            return module.exports.findById(id, tx);
        })
        .then(function (person) {
            if (person === null) {
                throw new errors.NotFound();
            }
            this.oldPerson = person;
            return person.updateAttributes(this.attrs, { transaction: tx });
        })
        .then(function (person) {
            this.person = person;
            return history.logUpdated(-1, getPersonIdCacheKey(person.Id), person, this.oldPerson, this.tx);
        })
        .then(function () {
            return this.tx.commit();
        })
        .then(function () {
            cache.put(getPersonIdCacheKey(this.person.id), this.person);
            return this.person;
        })
        .catch(function(err) {
            logger.error('Failed to update a person, %j.', err);
            if (this.tx) {
                this.tx.rollback();
            }
            throw err;
        });
});

/**
 * Remove a person.
 * @param {int} id job ID.
 */
var remove = module.exports.remove = Promise.method(function (id) {
    return module.exports.findById(id).bind({})
        .then(function (jobs) {
            if (jobs === null) {
                // No found, that's ok for remove() operation
                return;
            }
            this.jobs = jobs;
            return models.transaction()
                .then(function (tx) {
                    this.tx = tx;
                    return this.jobs.destroy({ transaction: this.tx });
                })
                .then(function () {
                    return history.logRemoved(-1, getPersonIdCacheKey(this.jobs.Id), this.jobs, this.tx);
                })
                .then(function () {
                    this.tx.commit()
                        .then(function () {
                            cache.remove(getPersonIdCacheKey(this.jobs.id),
                                getEmailsByPersonIdCacheKey(this.jobs.id));
                        })
                })
                .catch(function(err) {
                    logger.error('Failed to remove the job %j, %j.', id, err);
                    if (this.tx) {
                        this.tx.rollback();
                    }
                    throw err;
                });
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
            options = _.extend({ order: 'id'}, options);
            options.where = _.extend({}, options.where, { personId: personId });
            return models.PersonEmail.findAndCountAll(options)
                .then(function (result) {
                    cache.put(getEmailsByPersonIdCacheKey(personId), result);
                    return result;
                });
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
    return models.transaction().bind({})
        .then(function (tx) {
            this.tx = tx;
            return models.PersonEmail.create({ personId: personId, email: email, status: status }, { transaction: this.tx });
        })
        .then(function(result) {
            this.result = result;
            cache.remove(getEmailsByPersonIdCacheKey(personId));
            cache.put(getPersonIdByEmailCacheKey(email), personId);
            return history.log(-1, getPersonIdCacheKey(personId), 'email-add', {email: email, status: status}, {}, this.tx);
        })
        .then(function () {
            this.tx.commit();
            return this.result;
        })
        .catch(function(err) {
            logger.error('Failed to add an email, %j.', err);
            if (this.tx) {
                this.tx.rollback();
            }
            throw err;
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
    return models.PersonEmail.find(where, { transaction: transaction });
});

var changeEmailStatus = module.exports.changeEmailStatus = Promise.method(function (personId, emailIdOrValue, newStatus) {
    if (!validator.isIn(newStatus, ['active', 'pending'])) {
        throw new errors.InvalidParams('Invalid status');
    }
    return models.transaction().bind({})
        .then(function (tx) {
            this.tx = tx;
            return findEmail(personId, emailIdOrValue, this.tx);
        })
        .then(function(email) {
            if (email === null) {
                throw new errors.NotFound();
            }
            return email.updateAttributes({status: newStatus}, {transaction: this.tx});
        })
        .then(function(email) {
            this.email = email;
            return history.log(-1, getPersonIdCacheKey(personId), 'email-change-status', { email: email, status: newStatus }, email, this.tx);
        })
        .then(function () {
            this.tx.commit();
            return this.email;
        })
        .catch(function(err) {
            logger.error('Failed to update a status of email %j, %j.', emailIdOrValue, err);
            if (this.tx) {
                this.tx.rollback();
            }
            throw err;
        });
});


var removeEmail = module.exports.removeEmail = Promise.method(function (personId, emailIdOrValue) {
    return models.transaction().bind({})
        .then(function (tx) {
            this.tx = tx;
            return findEmail(personId, emailIdOrValue, this.tx);
        })
        .then(function(email) {
            if (email === null) {
                return; // Ok, nothing to delete
            }
            this.email = email;
            return this.email.destroy({ transaction: this.tx })
                .then(function () {
                    cache.remove(getEmailsByPersonIdCacheKey(personId), getPersonIdByEmailCacheKey(email));
                    return history.log(-1, getPersonIdCacheKey(personId), 'email-remove', { email: email }, email, this.tx);
                })
                .then(function () {
                    this.tx.commit();
                });
        })
        .catch(function(err) {
            logger.error('Failed to remove the email %j, %j.', emailIdOrValue, err);
            if (this.tx) {
                this.tx.rollback();
            }
            throw err;
        });
});
