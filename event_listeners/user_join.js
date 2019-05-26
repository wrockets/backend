const fs = require('fs');
const Discord = require('discord.js');
const log = require('../actions/log.js');
const path = './db/welcome_message.json'
module.exports = async function (bot) {
    bot.on("guildMemberAdd", async function (member) {
        var rn = new Date();
        var join_embed = new Discord.RichEmbed()
            .setColor("#FFFFFF")
            .setDescription(`**EVENT:** A user has joined the server\n**USER:** ${member}\n`)
            .setFooter(`DATE/TIME: ${rn.getUTCFullYear()}-${rn.getUTCMonth() + 1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`);
        // start of send welcome message
        if (!fs.existsSync(path))
            return
        welcome_message = JSON.parse(fs.readFileSync(path, 'utf8'))
        if (welcome_message[member.guild.id][0]) {
            await member.send(welcome_message[member.guild.id][0])
                .then(() => join_embed.setDescription(join_embed.description + `**STATUS:** Successfully sent a welcome message to the user`))
                .catch(() => join_embed.setDescription(join_embed.description + `**STATUS:** Couldn't send a welcome message to the user`));
        }
        // end of send welcome message
        log(bot, member.guild.id, join_embed, 'join');
    });
}