module.exports = {
	tournaments: require('./commands/tournaments.js'),
	ping: require('./commands/ping.js'),
	roles: require('./commands/roles.js'),
	addrole: require('./commands/addrole.js'),
	removerole: require('./commands/removerole.js'),
	clearroles: require('./commands/clearroles.js'),
	makemessage: require('./commands/makemessage.js'),
	editmessage: require('./commands/editmessage.js'),
	logchannel: require('./commands/log_channel.js'),
	moveall: require('./commands/move_voice_all.js')
}