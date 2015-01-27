var apiLinks = require('./api/links');

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
 * A call context, has information about current authenticated person, authenticated client, etc.
 * @param personId {number} ID of an authenticated person.
 * @param clientId {number} ID of an authenticated client (application).
 * @constructor
 */
var Context = function (personId, clientId, links) {
    "use strict";
    this.personId = +personId;
    this.clientId = +clientId;
    this.links = links || new apiLinks.Links();
};

module.exports.Context = Context;

/**
 * Get whether the context represents a System context, i.e. no authenticated user.
 * @returns {boolean}
 */
Context.prototype.isSystem = function() {
    return this.personId === module.exports.SystemPersonId;
};

/**
 * Clone an existing context.
 * @param context A Context instance to clone.
 */
module.exports.clone = function (context) {
    return new Context(context.personId, context.clientId, context.links);
};

/**
 * Create a "system" context. Used when an authenticated user is not available. For example, for actions taking place
 * before a user is authenticated, or executed on schedule, without user context.
 * @type {Context}
 */
module.exports.newSystemContext = function () {
    return new Context(module.exports.SystemPersonId, module.exports.SystemOrgId);
};
