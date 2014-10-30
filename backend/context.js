
/**
 * -1 is an ID of the SYSTEM user, used for system-wide activity.
 * @type {number}
 */
module.exports.SystemPersonId = -1;

/**
 * -2 is an internal TrueCron organization. Like the SYSTEM user, it is used for system-wide activity.
 * @type {number}
 */
module.exports.SystemOrgId = -2;

/**
 * A security context, has information about current authenticated person, authenticated client, etc.
 * @param personId {string} ID of an authenticated person.
 * @param clientId {string} ID of an authenticated client (application).
 * @constructor
 */
var Context = module.exports.Context = function (personId, clientId) {
    "use strict";
    this.personId = personId;
    this.clientId = clientId;
};

/**
 * Get whether the context represents a System context, i.e. no authenticated user.
 * @returns {boolean}
 */
Context.prototype.isSystem = function() {
    return this.personId === module.exports.SystemPersonId;
};

/**
 * A "system" context. Used when an authenticated user is not available. For example, for actions taking place
 * before a user is authenticated, or executed on schedule, without user context.
 * @type {Context}
 */
module.exports.SystemContext = new Context(module.exports.SystemPersonId, module.exports.SystemOrgId);