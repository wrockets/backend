const Discord = require('discord.js');
const log = require('../actions/log.js');
module.exports = async function (bot) {
    bot.on("guildMemberAdd", async function (member) {
        var join_embed = new Discord.RichEmbed()
            .setColor("#FFFFFF")
            .setDescription(`**EVENT:** A user has joined the server\n**USER:** ${member}\n`);
        // var log_channel = 
        await member.send("Welcome message")
            .then(() => join_embed.setDescription(join_embed.description + `**STATUS:** Successfully sent a welcome message to the user`))
            .catch(() => join_embed.setDescription(join_embed.description + `**STATUS:** Couldn't send a welcome message to the user`));
        log(bot, member.guild.id, join_embed);
    });
}