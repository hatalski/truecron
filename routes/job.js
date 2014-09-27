/**
 * Created by Andrew on 30.09.2014.
 */

var express = require('express');
var path = require('path');
var router = express.Router();
var log = require('../lib/logger');
var config = require('../lib/config');
var pg = require('pg');

var conString = "postgres://" +
    config.get('POSTGRE_USERNAME') +
    ":" + config.get('POSTGRE_PASSWORD') + "@" +
    config.get('POSTGRE_HOST') +
    ":" + config.get('POSTGRE_PORT')
    + "/" + config.get('POSTGRE_DATABASE');

log.info(conString);

router.get('/organizations/:org_id/workspaces/:workspace_id/jobs', function(req, res) {
    var organization_id = req.param('org_id');
    var workspace_id = req.param('workspace_id');


    debugger;
    var archived = req.param('archived', 0); // default: 0
    var active = req.param('active', 1); // default: 1
    var tags_job = req.param('tags');
    var sort = req.param('sort', 'name');
    var direction = req.param('direction', 'asc');
    var wherefordb;
    if(tags_job) {wherefordb = 'WHERE active=$1 AND archived=$2 AND workspaceId=$3 AND organizationId=$4 ORDER BY $5 $6; [active, archived, workspace_id, organization_id, sort, direction]'}
    else {wherefordb = 'WHERE active=$1 AND archived=$2 AND workspaceId=$3 AND organizationId=$4 AND tag=$5 ORDER BY $6 $7; [active, archived, workspace_id, organization_id, tags_job, sort, direction]'}

    log.info('org id: ' + organization_id);
    log.info('workspace id: ' + workspace_id);
    log.info('archived: ' + archived);

    pg.connect(conString, function(err, client, done) {
        if (err) {
            return console.error('could not connect to postgres', err);
        }
        client.query('SELECT tc.Job.id, tc.Job.workspaceId, tc.Job.name, tc.Job.active, tc.Job.archived, tc.Job.createdAt, tc.Job.updatedAt, tc.Job.updatedByPersonId, tc.Job.startsAt, tc.Job.rrule FROM tc.Job, tc.Workspace + wherefordb',
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }

                res.json({ "jobs": result.rows });

                client.end();
            });
    });
});

module.exports = router;