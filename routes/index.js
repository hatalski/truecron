var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'TrueCron' });
});

/*router.get('/hello', function(req, res) {
	res.render('hello', { title: 'Hello World' });
});*/

module.exports = router;
