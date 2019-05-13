const Discord = require('discord.js');
const log = require('../actions/log.js');
module.exports = async function (bot) {
    bot.on("guildMemberRemove", async function (member) {
        var leave_embed = new Discord.RichEmbed()
            .setColor("#FFFFFF")
            .setDescription(`**EVENT:** A user has left the server\n**USER:** ${member} (${member.displayName}) (${member.id})\n**DATE/TIME: **${Date.now()}`);
        log(bot, member.guild.id, leave_embed, 'join/leave');
    });
}