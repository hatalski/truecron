// vdm: this is simple application server to load the only static file hellocron.htm

// Load the http module to create an http server.
var http = require('http'),
    fs = require('fs'),
    argv = require('minimist')(process.argv.slice(2));

var port = argv.port ? argv.port : 3000;
var documentRoot = argv.documentRoot ? argv.documentRoot : '/var/www/truecron/';

// Configure our HTTP server to respond with content from the static file to all requests.
var server = http.createServer(function (request, response) {
	fs.readFile(documentRoot + 'hellocron.htm', function (err, html) {
	    if (err) {
	        throw err;
	    }
	    response.writeHeader(200, {"Content-Type": "text/html"});
	    response.write(html);
	    response.write(new Date().toJSON());
	    response.end();
	});
});

server.listen(port);

console.log("Server has been started");
