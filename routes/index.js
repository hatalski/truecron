var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'TrueCron' });
});

function validTokenProvided(req, res) {
    // Check POST, GET, and headers for supplied token.
    var userToken = req.body.token || req.param('token') || req.headers.token;
    if (!userToken) {
        res.send(401, { error: 'Authentication required'});
        return false;
    } else if (userToken != 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        res.send(401, { error: 'Invalid token. You provided: ' + userToken });
        return false;
    }
    return true;
}

router.get('/hello.json', function(req, res) {
    if (validTokenProvided(req, res)) {
        res.send([
            'Hello from Paul',
            'Hello from Natallia',
            'Hello from Dmitry',
            'Hello From Viny',
            'Hello world from Andrei!',
            'Hi from Lev!',
            'Hello from Vitalik!',
            'Hello from Vitali!'
        ]);
    }
});

module.exports = router;
