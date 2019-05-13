const Discord = require('discord.js');
const log = require('../actions/log.js');

/**
 * Returns the difference between the two array (elements that exist in only one of the arrays)
 * @param {number[]} x 
 * @param {number[]} y 
 * @returns {number[]} the elements that exist in only one of the arrays
 */
function compare_array(x, y) {
	var a = y.filter(e => !x.includes(e))
	if (a.length > 0)
		return a
	return x.filter(e => !y.includes(e))
}

module.exports = function (bot) {
	bot.on("guildMemberUpdate", async function (old, newm) {
		var executor, action_data = '';
		// date object placeholder
		var rn = new Date();
		// fetch Audit Logs
		let audit_logs = old.guild.fetchAuditLogs({ limit: 5 });
		// compares the roles of the old and new user to get the differnces in roles
		var difference = compare_array(old.roles.map(r => r.id), newm.roles.map(r => r.id));
		// check if the number of roles changed
		if (difference.length > 0) {
			let temp;
			if (old.roles.array().length > newm.roles.array().length)
				temp = 'remove';
			else
				temp = 'add';
			action_data += `**ACTION:** ${temp} role\n`;
			difference.forEach(function(r){
				action_data += `**ROLE ${difference.indexOf(r)+1}:** <@&${r}>\n`;
			})
			audit_logs = await audit_logs;
			audit_log_entry = audit_logs.entries.filter(e => e.action === 'MEMBER_ROLE_UPDATE').first();
			executor = audit_log_entry.executor;
			if(executor.bot){
				return
			}
		}
		else if (old.displayName != newm.displayName) {
			audit_logs = await audit_logs
			executor = audit_logs.entries.filter(e => e.action === 'MEMBER_UPDATE').first().executor;
			action_data += `**ACTION:** Username Change\n**FROM:** ${old.displayName}\u2003\u2003**TO:** ${newm.displayName}\n`;
		}
		else {
			return
		}
		let response = new Discord.RichEmbed()
			.setColor("#00FFFF")
			.setDescription(`${action_data}**EXECUTOR:** ${executor} (${executor.id})\n**TARGET USER:** ${old.user} (${old.user.id})\n**DATE/TIME: **${rn.getUTCFullYear()}-${rn.getUTCMonth()+1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`);
		log(bot, old.guild.id, response, 'member_update');
	})
}