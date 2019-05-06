const Discord = require('discord.js');
const log = require('../actions/log.js');
module.exports = function (bot) {
	bot.on("guildMemberUpdate", async function (old, newm) {
		var act = await old.guild.fetchAuditLogs({ limit: 1 });
		act = act.entries.first();
		if (!act) {
			console.log("error");
			return;
		}
		let executor = act.executor
		let target = act.target
		let action = act.changes[0].key.replace(/\W/g, '')
		let action_data = ''
		if (action === 'add' || action === 'remove') {
			action_data = `**ACTION:** Role ${action}\n**ROLE:** <@&${act.changes[0].new[0].id}>\n`;
		}
		else if (action === 'nick') {
			action_data = `**ACTION:** Nickname Change\n**FROM:** `
			if (act.changes[0].old)
				action_data += `${act.changes[0].old}`
			else
				action_data += `${target.username}`
			action_data += `\u2003\u2003**TO:** `
			if (act.changes[0].new)
				action_data += `${act.changes[0].new}\n`
			else
				action_data += `${target.username}\n`
		}
		else{
			console.log(action)
		}
		//role = bot.guilds.find(g => g.id === old.guild.id).roles.find(r => r.name === role)
		let response = new Discord.RichEmbed()
			.setColor("#00FFFF")
			.setDescription(`${action_data}**EXECUTOR:** ${executor}\n**TARGET USER:** ${target}\n`);
		log(bot, old.guild.id, response)
	})
}
//**ACTION:** Role ${action}\n**ROLE:** <@&${role.id}>\n
/*
GuildAuditLogsEntry {
  targetType: 'USER',
  actionType: 'UPDATE',
  action: 'MEMBER_ROLE_UPDATE',
  reason: null,
  executor:
   User {
     id: '298518538958667786',
     username: 'XtratoS',
     discriminator: '2159',
     avatar: 'b7bb4638fe6415b597bce2ff5b0076a4',
     bot: false,
     lastMessageID: null,
     lastMessage: null },
  changes: [ { key: '$remove', old: undefined, new: [Array] } ],
  id: '574454448584130561',
  extra: null,
  target:
   User {
     id: '298518538958667786',
     username: 'XtratoS',
     discriminator: '2159',
     avatar: 'b7bb4638fe6415b597bce2ff5b0076a4',
     bot: false,
     lastMessageID: null,
     lastMessage: null } }
*/