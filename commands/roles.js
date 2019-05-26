const Discord = require("discord.js");
const reaction_message_model = require("../models/reaction_roles_message.js")
const mongoose = require('mongoose');
const conf = require('../conf.js');
mongoose.connect(conf.mongodbs, { useNewUrlParser: true });

/**
 * Shows all the roles on all the messages in the server
 */
module.exports = async (bot, message, args) => {
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        message.reply("You don't have permission").then(async m => {
            await message.delete();
            return m.delete(15000);
        })
    }
    var response = new Discord.RichEmbed();
    if (args[1] == "help") {
        response
            .setColor("#FFFF00")
            .addField("More info", "Shows all the roles on all the messages in the server.")
        return message.channel.send(response)
    }
    var channels = message.guild.channels
    // find all the roles that can be added with reacting on any message in this server
    reaction_message_model.find({
        guildID: message.guild.id
    }, function (err, records) {
        if (err) { console.log(err); return }
        if (!records || records.length < 1) {
            // no saved roles for this server found in the database
            response
                .setColor("#FFFF00")
                .addField("Empty", "No reaction roles found in this server, use the command **addemo help** to figure out how to add roles on reacting to a message.")
            return message.channel.send(response).then(r => r.delete(60000));
        }
        // loop through all the found records, find the channel in which the message exists, then create a placeholder richembed
        records.forEach(async function (record) {
            channel_obj = await channels.find(c => c.id == record.channelID);
            message_obj = await channel_obj.fetchMessage(record.messageID);
            response
                .setColor("#F0FFFA")
                .setDescription(`[**Message Link**](https://discordapp.com/channels/${message.guild.id}/${channel_obj.id}/${message_obj.id})\n`)
            for (emote in record.roles) {
                // add each emoji and the corresponding role to the richembed
                response.setDescription((response.description || "") + "**—**" + emote + "**—" + record.roles[emote]["name"] + "—**\n");
            }
            message.channel.send(response);
        })
    })
}