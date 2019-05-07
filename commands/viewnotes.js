fs = require('fs');
Discord = require('discord.js');
path = './db/notes.txt';
hutil = require('../utilities/hutil.js')
module.exports =
    async function (bot, message, args) {
        if (!args[1] || args[1] === 'help') {
            return message.channel.send(
                new Discord.RichEmbed()
                    .setColor("#FFFF00")
                    .addField("Usage", "viewnotes <ID/@mention> <note>")
            )
        }
        var user = message.mentions.members.first();
        if (!user) {
            user = await message.guild.fetchMember(args[1]).catch(err => console.log(`Couldn't fetch user ${args[1]}\n`))
        }
        var response = new Discord.RichEmbed()
        if (!user) {
            response
                .setColor("#FF0000")
                .addField("Error", "Couldn't find a user with the given information, please mention the user or provide their ID")
            return message.reply(response);
        }
        console.log(user.id)
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        var notes = JSON.parse(fs.readFileSync(path, 'utf8'))[user.id]
        console.log(notes)
        response
            .setColor("#00FFFF")
            .setDescription('')
        var c1 = 0, c2 = 0, l = notes.length
        while (c2 < l) {
            if (c1 <= 1366) {
                response.setDescription(`${response.description} ${c2+1}.\u2003${notes[c2]} \n`)
                c1 += notes[c2].length
                if (c2 === l - 1) {
                    message.channel.send(response)
                }
                c2++
            } else {
                message.channel.send(response)
                response.setDescription('')
                c1 = 0
            }
        }
    }