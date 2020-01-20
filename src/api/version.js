const fs = require('fs');

var version_promise = new Promise(function(resolve, reject) {
	fs.readFile('package.json', function(err, data) {
		if (err || !data) {
			reject(err);
		} else {
			var json = JSON.parse(data);
			resolve(json.version);
		}
	});
});

var version = undefined;
version_promise.then(value => version = value);

function initialize(app) {
	app.get('/version', function (req, res) {
		if (version)
			res.json({version: version});

		else
			version_promise.then(value => res.json({version: value}));
	});
}


module.exports = { initialize }
