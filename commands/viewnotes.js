fs = require('fs');
Discord = require('discord.js');
path = './db/notes.json';
hutil = require('../utilities/hutil.js')
module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed()
        if (!args[1] || args[1] === 'help') {
            response
                .setColor("#FFFF00")
                .addField("Usage", "viewnotes <ID/@mention> <note>")
            return message.channel.send(response)
        }
        var user = message.mentions.members.first() || message.guild.memebers.find(m.id === args[1] || m.displayName === args[1]);
        var notes;
        if (!user) {
            console.log(`Couldn't fetch user ${args[1]}\n`);
        }
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '{}');
        }
        if (!user) {
            notes = JSON.parse(fs.readFileSync(path, 'utf8'))[message.guild.id]
        } else {
            notes = JSON.parse(fs.readFileSync(path, 'utf8'))[message.guild.id][user.id]
        }
        var response = new Discord.RichEmbed();
        response
            .setColor("#00FFFF")
            .setDescription('');
        var c1 = 0, c2 = 0, l = notes.length;
        while (c2 < l) {
            if (c1 <= 1366) {
                response.setDescription(`${response.description} ${c2 + 1}.\u2003${notes[c2]} \n`)
                c1 += notes[c2].length
                if (c2 === l - 1) {
                    message.channel.send(response);
                }
                c2++;
            } else {
                message.channel.send(response);
                response.setDescription('');
                c1 = 0;
            }
        }
    }