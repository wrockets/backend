const Discord = require("discord.js");

module.exports = async (bot, message, args) => {
    // Richembed placeholder
    var response = new Discord.RichEmbed();
    if (args[1] == "help") {
        response
            .setColor("#FFFF00")
            .addField("Usage", "editmessage <message_id> <message content>")
        return message.channel.send(response).then(r => r.delete(30000));
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
    message.channel.send("Loading...").then(async function (m) {
        for (var i = 0; i < l; i++) {
            if (channels[i].type == "text") {
                var good_message = await channels[i].fetchMessage(message_id).catch(err => { });
                // once message is found, edit it
                if (good_message) {
                    msg = message.toString().split(/ +/g).slice(2).join(" ");
                    if (good_message.author.id == message.guild.me.id) {
                        good_message.edit(msg);
                        response
                            .setColor("#00FF0F")
                            .addField("Success", `Message **${message_id}** have been edited.`);
                    } else {
                        response
                            .setColor("#FF0000")
                            .addField("Failture", `The bots isn't the author of this message hence the bot can't edit this message.`);
                    }
                    return m.edit(response).then(m => m.delete(60000));
                }
            }
        }
        response
            .setColor("#FF0000")
            .addField("Failture", `Couldn't find a message with the id **${message_id}** in this server.`);
        return m.edit(response).then(m => m.delete(60000));
    })
}