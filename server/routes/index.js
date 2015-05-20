var express = require('express');
var config  = require('../lib/config');
var router  = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'TrueCron'});
    //res.sendFile(path.join(__dirname+'/index.html'));
    //res.redirect(301, config.get('CLIENT_URL'));
});

module.exports = router;
