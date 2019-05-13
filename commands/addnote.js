Discord = require('discord.js');
fs = require('fs');
path = './db/notes.txt';
module.exports =
    async function (bot, message, args) {
        if (!args[2] || args[1] === 'help') {
            return message.channel.send(
                new Discord.RichEmbed()
                    .setColor("#FFFF00")
                    .addField("Usage", "addnote <ID/@mention> <note>")
            );
        }
        if (!message.member.hasPermission("KICK_MEMBERS") && !message.member.hasPermission("ADMINISTRATOR")) {
            await message.delete();
            return message.reply("You don't have permission");
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
            data[message.guild.id][user.id].push(note)
        } else {
            data[message.guild.id][user.id] = [note]
        }
        fs.writeFileSync(path, JSON.stringify(data));
        response
            .setColor("#00FF00")
            .addField("Success", "Note added successfully")
        return message.reply(response);
    }