const fs = require('fs');
const Discord = require('discord.js');
const path = './db/welcome_message.json';
const options = ['disable', 'enable'];
module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed()
        if (!args[1] || !options.includes(args[1].toLowerCase())) {
            response
                .setColor("#FFFF00")
                .addField("Usage", "welcome_message <enable/disable>")
            return message.channel.send(response)
        }
        if (args[1] === options[0]) {
            if (fs.existsSync(path)) {
                var data = JSON.parse(fs.readFileSync(path, 'utf8'))[message.guild.id]
                if (data && data[0]) {
                    delete data[0];
                    fs.writeFileSync(path, JSON.stringify(data));
                    response
                        .setColor("#FFA500")
                        .addField("Success", "Welcome message has been deleted for this server");
                    return message.reply(response);
                } else {
                    response
                        .setColor("#FFA500")
                        .addField("Information", "Welcome message is already disabled for this server");
                    return message.reply(response);
                }
            }
        } else {
            if (!fs.existsSync(path)) {
                fs.writeFileSync(path, '{}');
            }
            var current = JSON.parse(fs.readFileSync(path, 'utf8'));
            // start of new data collector
            response
                .setColor("#005E99")
                .addField('Information', 'Please input the welcome message that you would like the new members to recieve in DMs, you can also type "cancel" to cancel this command')
                .setFooter('Automatically cancels in 3 minutes');
            message.channel.send(response);
            var temp = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 180000, maxMatches: 1 })
            if (!temp.first() || temp.first().content.toLowerCase() === 'cancel') {
                return message.reply('Command cancelled');
            } else {
                if (!current[message.guild.id]) {
                    current[message.guild.id] = {}
                }
                current[message.guild.id][0] = temp.first().content;
                fs.writeFileSync(path, JSON.stringify(current))
                return message.reply(
                    new Discord.RichEmbed()
                        .setColor("#00FF00")
                        .addField('Success', `Welcome message has been set to \`\`\`${temp.first().content}\`\`\``)
                )
            }
            // end of new data collector
        }
    }