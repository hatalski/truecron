var util = require('util'),
    validator = require('../lib/validator'),
    logger = require('../lib/logger');

function Links(url) {
    'use strict';
}

Links.prototype.compose = function (url, params, options) {
    if (!params.length) {
        return url;
    }

    if (options == undefined) {
        throw new Error('Cannot create a link, missing parameter(s): ' + params);
    }

    // Allow the last parameter to be passed as an integer.
    if (validator.isInt(options)) {
        var id = +options;
        options = {};
        options[params[params.length - 1]] = id;
    }

    var result = url;
    var self = this;
    params.forEach(function (param) {
        var value = options[param] || self[param];
        if (!value) {
            throw new Error('Cannot create a link ' + url + ', missing parameter: ' + param);
        }
        result = result.replace(':' + param, value);
    });
    return result;
};

(function () {
    var urls = {
        users:                  '/users',
        user:                   '/users/:userId',
        userHistory:            '/users/:userId/history',
        userEmails:             '/users/:userId/emails',
        userEmail:              '/users/:userId/emails/:emailId',
        userEmailHistory:       '/users/:userId/emails/:emailId/history',
        organizations:          '/organizations',
        organization:           '/organizations/:organizationId',
        organizationHistory:    '/organizations/:organizationId/history',
        organizationMembers:    '/organizations/:organizationId/members',
        organizationMember:     '/organizations/:organizationId/members/:memberId',
        workspaces:             '/organizations/:organizationId/workspaces',
        workspace:              '/organizations/:organizationId/workspaces/:workspaceId',
        workspaceHistory:       '/organizations/:organizationId/workspaces/:workspaceId/history',
        workspaceMembers:       '/organizations/:organizationId/workspaces/:workspaceId/members',
        workspaceMember:        '/organizations/:organizationId/workspaces/:workspaceId/members/:workspaceMemberId',
        connections:            '/organizations/:organizationId/connections',
        connection:             '/organizations/:organizationId/connections/:connectionId',
        connectionHistory:      '/organizations/:organizationId/connections/:connectionId/history',
        jobs:                   '/organizations/:organizationId/workspaces/:workspaceId/jobs',
        job:                    '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId',
        jobHistory:             '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/history',
        tasks:                  '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/tasks',
        task:                   '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/tasks/:taskId',
        taskHistory:            '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/tasks/:taskId/history',
        runs:                   '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/runs',
        run:                    '/organizations/:organizationId/workspaces/:workspaceId/jobs/:jobId/runs/:runId'
    };
    Object.keys(urls).forEach(function (name) {
        var url = urls[name];
        var params = url.split('/')
                        .filter(function (part) { return part[0] === ':'; })
                        .map(function (param) { return param.slice(1); });
        //Links.prototype[name] = Links.prototype.compose.bind(null, url, params);
        Links.prototype[name] = function (options) {
            return this.compose(url, params, options);
        };
    });
})();

module.exports.Links = Links;
