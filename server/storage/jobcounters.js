/**
 * Created by Andrew on 29.04.2015.
 */

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


//
// JobCounter
//
/**
 * Create a new jobcounter.
 */
var create = module.exports.create = Promise.method(function (context, attributes) {
    attributes = tools.sanitizeAttributesForCreate(context, attributes);
    if (!attributes.jobId) {
        throw new errors.InvalidParams('Job ID is not specified.');
    }
    if (!attributes.organizationId) {
        throw new errors.InvalidParams('Organization ID is not specified.');
    }
    if (!attributes.workspaceId) {
        throw new errors.InvalidParams('Workspace ID is not specified.');
    }
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return models.JobCounters.create(locals.attrs, { transaction: tx })
            .then(function(jobcounter) {
                return jobcounter;
            });
    })
        .catch(function (err) {
            logger.error('Failed to create a jobCounter, %s.', err.toString());
            throw err;
        });
});

/**
 * Search for a single jobcounter by jobID.
 */
var findByJobId = module.exports.findByJobId = Promise.method(function (context, id, workspaceRole, transaction) {
    id = tools.getId(id);
    workspaceRole = workspaceRole || workspaceAccess.WorkspaceRoles.Viewer;
    var locals = {};
    return models.JobCounters.find({
        where: { jobId: id }}, {
        transaction: transaction
    })
    .then(function (jobcounter) {
        if (jobcounter === null) {
            return null;
        }
            return jobcounter;
    })
    .catch(function (err) {
        logger.error('Failed to find a jobcounter by jobId %s, %s.', id, err.toString());
        throw err;
    });
});

var ensureCanView = module.exports.ensureCanView = function (context, job) {
    return findById(context, job, workspaceAccess.WorkspaceRoles.Viewer);
};

var ensureCanEdit = module.exports.ensureCanEdit = function (context, job) {
    return findById(context, job, workspaceAccess.WorkspaceRoles.Editor);
};


/**
 * Update a jobcounter.
 */
var update = module.exports.update = Promise.method(function (context, id, attributes) {
    attributes = tools.sanitizeAttributesForUpdate(context, attributes);
    var locals = { attrs: attributes };
    return using (models.transaction(), function (tx) {
        return module.exports.findByJobId(context, id, workspaceAccess.WorkspaceRoles.Editor, tx)
            .then(function (jobcounter) {
                if (jobcounter === null) {
                    throw new errors.NotFound();
                }
                locals.oldJobCounter = jobcounter;
                return jobcounter.updateAttributes(locals.attrs, { transaction: tx });
            })
            .then(function (jobcounter) {
                // Process tags
                locals.jobcounter = jobcounter;
                return jobcounter;
            });
    })
        .catch(function (err) {
            logger.error('Failed to update the jobcounter %d, %s.', id, err.toString());
            throw err;
        });
});

