var express = require('express'),
    app = express.createServer();
app.use(express.bodyParser());
app.post('/api/v1/jobs', function(req, res) {
    res.send(req.body);
});
