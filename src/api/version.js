const version = require('../data/version.js');

function initialize(app) {
	app.get('/version', function (req, res) {
		res.json({version: version.currentVersion()});
	});
}


module.exports = { initialize };
