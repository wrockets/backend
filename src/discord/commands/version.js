const version = require('../../data/version.js');

function versionCommand(msg, args) {
	msg.reply("Rocketry Bot version v" + version.currentVersion());
}

module.exports = versionCommand;
