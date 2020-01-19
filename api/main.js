const express = require('express');
const version = require('../version.js');

const api = (function() {
	var app = express();

	app.get('/version', function (req, res) {
		res.json({version: version});
	})

	return {
		start: function() { app.listen(3000); },
		get: function(route, handler) { app.get(route, handler); },
		post: function(route, handler) { app.post(route, handler); }
	}
})();

module.exports = api;
