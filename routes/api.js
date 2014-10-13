/**
 * Created by Andrew on 30.09.2014.
 */

var express = require('express');
var path = require('path');
var router = express.Router();
var log = require('../lib/logger');
var config = require('../lib/config');
var pg = require('pg.js');

var conString = "postgres://" +
    config.get('POSTGRE_USERNAME') +
    ":" + config.get('POSTGRE_PASSWORD') + "@" +
    config.get('POSTGRE_HOST') +
    ":" + config.get('POSTGRE_PORT')
    + "/" + config.get('POSTGRE_DATABASE');

router.get('/echo', function(req, res) {
   res.json({ message: 'OK' });
});

router.get('/organizations/:org_id/workspaces/:workspace_id/jobs', function(req, res) {
    var organization_id = req.param('org_id');
    var workspace_id = req.param('workspace_id');
    var archived = req.param('archived', 0); // default: 0
    var active = req.param('active', 1); // default: 1
    var tags_job = req.param('tags');
    var sort = req.param('sort', 'name');
    var direction = req.param('direction', 'asc');
    var wherefordb;

    if(!tags_job){
        wherefordb='WHERE active='+active+' AND archived='+archived+' AND workspaceId='+workspace_id+' AND organizationId='+organization_id+' ORDER BY '+sort+' '+direction+';';
    }
    else {
        wherefordb='WHERE active='+active+' AND archived='+archived+' AND workspaceId='+workspace_id+' AND organizationId='+organization_id+' AND tag='+tags_job+'  ORDER BY '+sort+' '+direction+';';
    }

    pg.connect(conString, function(err, client, d) {
        if(err) {
            log.info('could not connect to postgres: ' + err);
        }
        client.query('SELECT tc.Job.id, tc.Job.workspaceId, tc.Job.name, tc.Job.active, tc.Job.archived, tc.Job.createdAt, ' +
                'tc.Job.updatedAt, tc.Job.updatedByPersonId, tc.Job.startsAt, tc.Job.rrule FROM tc.Job, ' +
                'tc.Workspace '+wherefordb,
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }

                res.status(200).json({ "jobs": result.rows });

                client.end();
            });

    });
});
function addJobtags(jobsId, tags){
    query("insert into tc.JobTag (jobId, tag) values ($1, $2);", [jobsId, tags]);
    console.log('in addJobsTag jobId + tag='+jobsId);

}
/*post job create*/
router.post('/organizations/:org_id/workspaces/:workspace_id/jobs', function(req, res) {
    var workspace_id = req.param('workspace_id');
    var input = JSON.parse(JSON.stringify(req.body));
    var updatedByPersonId=1;
    var rrule;

    if(!input.rrule){
        rrule=' ';
    }
    else {
        rrule=input.rrule;
    }

    if (input.name.replace(/\s/g, '') == '') {
        res.status(400).send('Invalid parameter - name');
        console.log('Invalid parameter - name');
    }
    else {
        pg.connect(conString, function (err, client, d) {
            if (err) {
                log.info('could not connect to postgres: ' + err);
            }
            client.query('insert into tc.Job (workspaceId, name, active, archived, updatedByPersonId, startsAt, rrule) values ($1, $2, $3, $4, $5, $6, $7) returning id;', [workspace_id, input.name, 0, 0, updatedByPersonId, input.startsAt, rrule],
                function (err, result) {
                    if (err) {
                        return console.error('error running query', err);
                    }
                    console.log('tags='+input.tags);
                    /*if(input.tags){
                        console.log('in if');
                        addJobtags(Number(result.rows[0].id), input.tags);
                    }
                    console.log('id='+Number(result.rows[0].id));*/
                    res.status(201).json({ "job": {'id': Number(result.rows[0].id)}});

                    client.end();
                });
        });
    }
});


/*patch Job (update)*/

router.patch('/organizations/:org_id/workspaces/:workspace_id/jobs/:jobId', function(req, res) {
    var workspace_id = req.param('workspace_id');
    var job_id = req.param('jobId');
    var input = JSON.parse(JSON.stringify(req.body));

    pg.connect(conString, function(err, client, d) {
        if(err) {
            log.info('could not connect to postgres: ' + err);
        }
        client.query('update tc.Job set startsAt=$1, rrule=$2 where tc.Job.id = job_id);', [input.startsAt, input.rrule],
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.status(200).json({ "job": result });
                client.end();
            });
    });
});

/*delete job*/

router.delete('/organizations/:org_id/workspaces/:workspace_id/jobs/:jobId', function(req, res) {
    var job_id = req.param('jobId');

    pg.connect(conString, function(err, client, d) {
        if(err) {
            log.info('could not connect to postgres: ' + err);
        }
        client.query('delete from tc.Job where tc.Job.id = job_id);',
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.status(204);
                client.end();
            });
    });
});

/*inactivate job*/
router.patch('/organizations/:org_id/workspaces/:workspace_id/jobs/:jobId/activate/:active', function(req, res) {
    var job_id = req.param('jobId');
    var activeFlag= req.param('active');
    
    pg.connect(conString, function(err, client, d) {
        if(err) {
            log.info('could not connect to postgres: ' + err);
        }
        client.query('update tc.Job set active=$1, where tc.Job.id = job_id);', [activeFlag],
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.status(201);
                client.end();
            });
    });
});

/*archived job*/

router.patch('/organizations/:org_id/workspaces/:workspace_id/jobs/:jobId/archived/:archive', function(req, res) {
    var job_id = req.param('jobId');
    var archivedFlag= req.param('archive');

    pg.connect(conString, function(err, client, d) {
        if(err) {
            log.info('could not connect to postgres: ' + err);
        }
        client.query('update tc.Job set archived=$1, where tc.Job.id = job_id);', [archivedFlag],
            function (err, result) {
                if (err) {
                    return console.error('error running query', err);
                }
                res.status(201);
                client.end();
            });
    });
});
module.exports = router;