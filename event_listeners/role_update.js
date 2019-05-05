const Discord = require('discord.js');
const log = require('../actions/log.js');
module.exports = function (bot) {
  bot.on("guildMemberUpdate", async function (old, newm) {
    var act = await old.guild.fetchAuditLogs({ limit: 3 });
    act = act.entries.find(e => e.action === "MEMBER_ROLE_UPDATE");
    if (!act) {
      console.log("ERR");
      return;
    }
    let executor = act.executor.username
    let target = act.target.username
    let action = act.changes[0].key.replace(/\W/g, '')
    let role = act.changes[0].new[0].name
    role = bot.guilds.find(g => g.id === old.guild.id).roles.find(r => r.name === role)
    let response = new Discord.RichEmbed()
      .setColor("#00FFFF")
      .setDescription(`**ACTION:** Role ${action}\n**TARGET USER:** ${target}\n**ROLE:** ${role}\n**EXECUTOR:** ${executor}\n`);
    log(bot, old.guild.id, response)
  })
}
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