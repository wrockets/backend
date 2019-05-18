const Discord = require('discord.js');
const fs = require('fs');
const path = './db/notes.txt';

module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed();
        if (!args[2] || args[1] === 'help') {
            response
                .setColor("#FFFF00")
                .addField("Usage", "addnote <ID/@mention> <note>")
            return message.channel.send(response);
        }
        if (!message.member.hasPermissions('VIEW_AUDIT_LOG')) {
            message.reply("You don't have permission");
            return message.delete();
        }
        var user = message.mentions.members.first() || message.guild.members.find(m => m.id === args[1] || m.displayName === args[1] || m.user.name === args[1])
        if (!user) {
            var response = new Discord.RichEmbed()
                .setColor("#FF0000")
                .addField("Error", `Couldn't find the user ${args[1]}, please mention the user or provide their ID`);
            console.log(`Couldn't fetch user ${args[1]}\n`);
            return message.reply(response);
        }
        var note = args.slice(2).join(" ")
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        var data = JSON.parse(fs.readFileSync(path, 'utf8'))
        if (data[message.guild.id][user.id]) {
            data[message.guild.id][user.id].push(note);
        } else {
            data[message.guild.id][user.id] = [note];
        }
        fs.writeFileSync(path, JSON.stringify(data));
        response
            .setColor("#00FF00")
            .addField("Success", "Note added successfully")
        return message.reply(response);
    }