/**
 * Created by Andrew on 30.09.2014.
 */

var pg = require('pg');

var conString = "postgres://vagrant:vagrant@192.168.3.20:5432/vagrant";

var client = new pg.Client(conString);
client.connect(function(err) {
    if(err) {
        return console.error('could not connect to postgres', err);
    }
    client.query('SELECT * FROM tc.job WHERE active = 1', function(err, result) {
        if(err) {
            return console.error('error running query', err);
        }
        //return result;
        console.log(result.rows[0]);
        client.end();
    });
});