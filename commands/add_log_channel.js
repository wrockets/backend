const Discord = require('discord.js');
const fs = require('fs');
const path = './db/log_c.json';
const types = ['mute', 'member_update', 'join/leave'];

module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed();
        var guild;
        var channel;
        if (!args[2] || args[1].toLowerCase() === "help") {
            response
                .setColor("#FFFF00")
                .addField("Usage", "addlogchannel <channel_id> <log_channel_type>")
                .addField("Available Channel Types", `${types.join('\n')}`);
            return message.channel.send(response);
        }
        if (!message.member.hasPermission("VIEW_AUDIT_LOG")) {
            await message.delete();
            return message.reply("You don't have permission");
        }
        if (types.indexOf(args[2]) < 0) {
            response
                .setColor("#FF0000")
                .addField("Error", `Logging channel type **${args[2]}** in incorrect`)
            return message.channel.send(response);
        }
        guild = message.guild;
        channel = message.mentions.channels.first() || guild.channels.find(c => c.id === args[1] || c.name === args[1]);
        if (!channel) {
            response
                .setColor("#FF0000")
                .addField("Error", `Couldn't find channel ${args[1]}`)
            return message.channel.send(response);
        }

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        var data = JSON.parse(fs.readFileSync(path, 'utf8'));
        response
            .setColor("#00FFFF");
        if (!data[guild.id]) {
            data[guild.id] = {};
            response
                .addField("Success", `Channel ${channel} has been added as the **${args[2]}** logging channel`);
        } else {
            response
                .addField("Success", `Channel ${channel} has replaced the existing **${args[2]}** logging channel`);
        }
        data[guild.id][args[2]] = channel.id;
        try {
            fs.writeFileSync(path, JSON.stringify(data));
        } catch (err) {
            console.log(err);
            return message.channel.send(``)
        }
        return message.channel.send(response);
    }