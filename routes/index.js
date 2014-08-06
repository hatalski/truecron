var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.sendfile(path.normalize(__dirname + '/../hellocron.htm'));
	// res.render('index', { title: 'Express' });
});

module.exports = router;
