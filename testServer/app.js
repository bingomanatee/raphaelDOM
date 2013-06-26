var staticServer = require('node-static');
var fs = require('fs');
var path = require('path');

var file = new (staticServer.Server)(path.resolve(__dirname, 'public'));

require('http').createServer(function (request, response) {
	request.addListener('end', function () {
		file.serve(request, response);
	});
}).listen(8123);