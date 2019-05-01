const Discord = require("discord.js");

module.exports = async (bot, message, args) => {
    if (args[1] == "help") {
        var help = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Usage", "editmessage <message_id> <message content>")
        return message.channel.send(help).then(r => r.delete(30000));
    }
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        message.reply("You don't have permission").then(async m => {
            await message.delete();
            return m.delete(15000);
        })
    }
    message_id = args[1];
    // put all channels in the server in an array
    var channels = message.guild.channels;
    var l = channels.array().length;
    channels = channels.first(l);
    // channels is now an arrray of all the channels in this server
    // now keep looping through the text channels and try to fetch the message
    var good_message;
    message.channel.send("Loading...").then(async m => {
        for (var i = 0; i < l; i++) {
            if (channels[i].type == "text") {
                good_message = await channels[i].fetchMessage(message_id).catch(err => { });
                // once message is found, edit it
                if (good_message) {
                    msg = message.toString().split(/ +/g).slice(2).join(" ");
                    if (good_message.author.id == message.guild.me.id) {
                        good_message.edit(msg);
                        return m.edit(
                            new Discord.RichEmbed()
                                .setColor("#00FF0F")
                                .addField(
                                    "Success",
                                    `Message **${message_id}** have been edited.`
                                )
                        ).then(n => n.delete(30000));
                    } else {
                        return m.edit(
                            new Discord.RichEmbed()
                                .setColor("#FF0000")
                                .addField("Failture", `The bots isn't the author of this message hence the bot can't edit this message.`)
                        ).then(m => m.delete(60000));
                    }
                }
            }
        }
        return m.edit(
            new Discord.RichEmbed()
                .setColor("#FF0000")
                .addField("Failture", `Couldn't find a message with the id **${message_id}** in this server.`)
        ).then(m => m.delete(60000));
    })
}