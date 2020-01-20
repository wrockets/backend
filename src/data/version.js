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

function getVersion() {
	if (version)
		return version;

	return "000";
}


module.exports = { currentVersion: getVersion };
