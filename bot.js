const Discord = require('discord.js');
const conf = require('./conf.js');
const DT = require('luxon').DateTime;
const user_join = require('./event_listeners/user_join.js');
const user_leave = require('./event_listeners/user_leave.js');
const member_update = require('./event_listeners/member_update.js');
const on_message = require('./event_listeners/message.js');
const raw_event = require('./event_listeners/raw_event.js');

const client = new Discord.Client();

client.on('ready', function () {
	console.log(`Logged in as ${client.user.tag}!`);
});

on_message(client);
raw_event(client);
user_join(client);
user_leave(client)
member_update(client);

client.login(conf.botToken);