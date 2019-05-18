const Discord = require("discord.js")
const hutil = require("../utilities/hutil.js")
const reaction_message_model = require("../models/reaction_roles_message.js")
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://XtratoS:UfTMXyIAxTN6Xr3q@nbot-dg4ad.mongodb.net/rbot?retryWrites=true', { useNewUrlParser: true })

/**
 * Has 2 usages:
 * -If a role/emoji is provided, removed that role/emoji from the specified message,
 * -If no role/emoji provdided, removes all the roles/emojis from the specified message.
 */
module.exports = async (bot, message, args) => {
    var response = new Discord.RichEmbed()
    if (!args[1] || args[1] == "help") {
        response
            .setColor("#FFFF00")
            .addField("Usage", "removerole <message_id> <role>/<emoji>")
            .addField("More info", "*Has 2 usages*:\nIf a role/emoji is provided, removed that role/emoji from the specified message,\n-If no role/emoji provdided, removes all the roles/emojis from the specified message.")
        return message.channel.send(response)
    }
    if (!message.member.hasPermission("MANAGE_ROLES")) {
        message.reply("You don't have permission").then(async m => {
            await message.delete()
            return m.delete(15000)
        })
    }
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        message.reply("Bot doesn't have permission").then(async m => {
            await message.delete()
            return m.delete(15000)
        })
    }
    var message_id = args[1];
    if (!args[2]) {
        // remove the whole record that includes this message
        response
            .setColor("#FFA500")
            .addField("Warning", "You didn't provide a role/emoji to remove, would you like to remove all the roles/emojis bounded to this message?")
            .addField("Respone", "Type **Yes** to overwrite or anything else to Cancel")
            .setDescription("*This command will be automatically cancelled in 60 seconds*");
        msg = message.channel.send(response);
        const filter = m => m.author.id === message.author.id;
        var response = await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async function (collected) {
            temp = new Discord.RichEmbed();
            if (!collected.first()) {
                msg.edit(temp
                    .setColor("#FF0000")
                    .addField("Failture", "Command timed out")
                ).then(m => m.delete(30000))
                return false;
            }
            if (collected.first().content.toLowerCase() == "yes") {
                return true;
            } else {
                msg.edit(temp
                    .setColor("#FFFF00")
                    .addField("Information", "Command Cancelled")
                ).then(m => m.delete(30000))
                return false;
            }
        }).catch(r => console.log(r))
        if (!response) {
            return;
        }
        reaction_message_model.deleteOne({
            messageID: message_id
        }, (err, rem) => {
            if (err) {
                console.log(err);
                return;
            }
            var response2 = new Discord.RichEmbed()
            if (!rem) {
                response2
                    .setColor("#F0FFF0")
                    .addField("Notification", "No roles were found for this message in the database to remove.");
            } else {
                response2
                    .setColor("#00FFF0")
                    .addField("Notification", `All roles/emojis on message with the id **${message_id}** were deleted from the database.`);
            }
            return message.channel.send(response2).then(r => r.delete(30000))
        })
    } else {
        // remove only the specified emoji or corresponding role
        reaction_message_model.findOne({
            messageID: message_id
        }, async function (err, rem) {
            if (err) {
                console.log(err);
                return;
            }
            if (!rem) {
                response
                    .setColor("#F0FFF0")
                    .addField("Notification", "No roles were found in the database to remove.");
                return message.channel.send(response).then(r => r.delete(30000));
            } else {
                // temp = JSON.parse(JSON.stringify(rem.roles))
                // remove the role from the roles object
                var success = false;
                var reem;
                for (emoji in rem.roles) {
                    if (args[2] == emoji || args[2] == rem.roles[emoji].name) {
                        reem = emoji;
                        delete rem.roles[emoji];
                        success = true;
                        // check if the roles object is now empty to remove the whole record
                        if (hutil.isEmpty(rem.roles)) {
                            reaction_message_model.deleteOne({
                                messageID: message_id
                            }, (err, rem2) => {
                                if (err) { console.log(err); return }
                            });
                        } else {
                            // if not empty just save the object after removing the role from it
                            reaction_message_model.updateOne({
                                messageID: message_id
                            },
                                {
                                    $set: {
                                        roles: rem.roles
                                    }
                                }).catch(err => console.log(err));
                        }
                    }
                }
                if (!success) {
                    response
                        .setColor("#FF0000")
                        .addField("Failture", `Couldn't do it :cry:`);
                    return message.channel.send(response);
                }
                role_channel = message.guild.channels.find(function (f) {
                    if (f.id == rem.channelID) {
                        return f;
                    }
                })
                good_message = await role_channel.fetchMessage(message_id).catch(function (err) {
                    response
                        .setColor("#FF0000")
                        .addField("Error", `Couldn't find message with the id ${message_id}`);
                    console.log(err);
                    return message.channel.send(response);
                })
                reaction = await good_message.reactions.find(function (f) {
                    if (f.me == true && f.emoji.name == reem) {
                        return f;
                    }
                })
                if (reaction) {
                    reaction.remove();
                }
                response
                    .setColor("#00FF00")
                    .addField("Success", "The designated role/emoji was deleted from the designated message on the database.");
                return message.channel.send(response).then(r => r.delete(30000));
            }
        })
    }
}