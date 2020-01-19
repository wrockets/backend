const Discord  = require('discord.js');
const conf     = require('./conf.js');
const DT       = require('luxon').DateTime;
const commands = require('./commands.js');
const Args     = require('string-argv');
const Api      = require('./api/main.js');

const client = new Discord.Client();

client.on('ready', function() {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', function (msg){
	if (msg.content.startsWith(conf.commandPrefix)) {
		var args = Args(msg.content);
		var cmd = args[0].substring(conf.commandPrefix.length);

		if (commands[cmd])
			commands[cmd](msg, args);

		else
			msg.reply("Sorry, I don't know that command");
	}
});

client.login(conf.botToken);

Api.start();
