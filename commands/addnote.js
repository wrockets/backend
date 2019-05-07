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
            )
        }
        var user = message.mentions.members.first();
        if (!user) {
            user = await message.guild.fetchMember(args[1]).catch(err => console.log(`Couldn't fetch user ${args[1]}\n`))
        }
        let response = new Discord.RichEmbed()
        if (!user) {
            response
                .setColor("#FF0000")
                .addField("Error", "Couldn't find a user with the given information, please mention the user or provide their ID")
            return message.reply(response);
        }
        var note = args.slice(2).join(" ")
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        var data = JSON.parse(fs.readFileSync(path, 'utf8'))
        if (data[user.id]) {
            data[user.id].push(note)
        } else {
            data[user.id] = [note]
        }
        fs.writeFileSync(path, JSON.stringify(data));
        response
            .setColor("#00FF00")
            .addField("Success", "Note added successfully")
        return message.reply(response);
    }