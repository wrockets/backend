const express = require('express');

var app = express();

/* Load controllers */
var controllers = [
	require('./version.js'),
];

controllers.forEach(controller => controller.initialize(app))

module.exports = {
	start: function() { app.listen(3000); },
}
