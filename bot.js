const Discord = require('discord.js');
const conf = require('./conf.js');
const DT = require('luxon').DateTime;
const commands = require('./commands.js');
const Args = require('string-argv');
const reaction_bot = require("./reaction_roles.js");

const client = new Discord.Client();

client.on('ready', function () {
	console.log(`Logged in as ${client.user.tag}!`);
});

// check every event for reaction add/remove on the reaction role message.
client.on("raw", function (event) {
	const event_type = event.t;
	if ((event_type === "MESSAGE_REACTION_ADD" || event_type === "MESSAGE_REACTION_REMOVE")) {
		reaction_bot.run(client, event).catch(err => console.log(err));
	}
})

client.on('message', function (msg) {
	if (msg.content.startsWith(conf.commandPrefix)) {
		var args = Args(msg.content);
		var cmd = args[0].substring(conf.commandPrefix.length);
		if (commands[cmd])
			commands[cmd](client, msg, args);
		else
			msg.reply("Sorry, I don't know that command");
	}
});

client.login(conf.botToken);