/**
 * Created by Andrew on 26.09.2014.
 */
var express = require('express');
var app = express();

app.get('/api/v1/jobs', function(req, res) {
    res.type('json');
    res.send({
        "id": "1",
        "name": "My first job",
        "tags": ["test", "tag1"],
        "starts_at": "2014-08-21T10:00:11Z",
        "rrule": "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO;BYHOUR=6;BYMINUTE=0;BYSECOND=0",
        "active": true,
        "archived": false,
        "created_at": "2014-08-21T10:00:11Z",
        "owner": {
            "login": "alice@example.com",
            "id": "123",
            "name": "Alice",
            "avatar_url": "https://static.truecron.com/i/ASjdwfh3.png",
            "_links": {
                "self": "https://api.truecron.com/v1/users/123"
            }
        },
        "updated_at": "2014-08-21T11:20:34Z",
        "updated_by": {
            "login": "bob@example.com",
            "id": "124",
            "name": "Bob",
            "_links": {
                "self": "https://api.truecron.com/v1/users/124"
            }
        },
        "last_run": {
            "id": "865D765S654236457Fhjgjg",
            "started_at": "2014-08-25T06:00:00Z",
            "status": "succeeded",
            "elapsed_msec": 7000,
            "_links": {
                "self": "https://api/truecron.com/v1/job/1/results/865D765S654236457Fhjgjg"
            }
        },
        "next_run_at": "2014-09-01T06:00:00Z",
        "_links": {
            "self": "https://api.truecron.com/v1/jobs/1",
            "tasks": "https://api.truecron.com/v1/jobs/1/tasks",
            "history": "https://api.truecron.com/v1/jobs/1/history",
            "results": "https://api.truecron.com/v1/jobs/1/results"
        }
    });
});
app.listen(process.env.PORT || 3000);