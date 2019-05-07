const Discord = require('discord.js');
const fs = require('fs');

const path = './db/log_c.txt';

module.exports = function (bot, message, args) {
    var response = new Discord.RichEmbed()
    if (!args[1] || args[1].toLowerCase() === "help") {
        response
            .setColor("#FFFF00")
            .addField("Usage", "log_channel <channel_id>")
        return message.channel.send(response)
    }
    if (!message.member.hasPermission("VIEW_AUDIT_LOG")) {
        message.reply("You don't have permission").then(async function (m) {
            await message.delete();
            return m.delete(15000);
        })
    }
    var guild = message.guild;
    var channel = guild.channels.find(c => c.id === args[1]);
    if (!channel) {
        response
            .setColor("#FF0000")
            .addField("Error", `Couldn't find channel ${args[1]}`)
        return message.channel.send(response);
    }
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }
    var data = JSON.parse(fs.readFileSync(path, 'utf8')) || '';
    if (!data[guild.id]) {
        response
            .setColor("#00FFFF")
            .addField("Success", `Channel ${channel} has been added as the logging channel`)
    } else {
        response
            .setColor("#00FFFF")
            .addField("Success", `Channel ${channel} has replaced the existing logging channel`)
    }
    data[guild.id] = args[1];
    fs.writeFileSync(path, JSON.stringify(data));
    return message.channel.send(response);
}