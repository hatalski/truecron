var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.redirect(301, 'http://localhost:4200');
});

module.exports = router;
