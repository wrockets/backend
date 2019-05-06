const Discord = require('discord.js');
const conf = require('./conf.js');
const DT = require('luxon').DateTime;
const commands = require('./commands.js');
const Args = require('string-argv');
const user_join = require('./event_listeners/user_join.js');
const member_update = require('./event_listeners/member_update.js');
// const on_message = require('./event_listeners/message.js');
const raw_event = require('./event_listeners/raw_event.js');

const client = new Discord.Client();

client.on('ready', function () {
	console.log(`Logged in as ${client.user.tag}!`);
});

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

raw_event(client);
user_join(client);
member_update(client);

client.login(conf.botToken);