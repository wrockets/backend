const Discord = require("discord.js")
const hutil = require("../utilities/hutil.js")
const reaction_message_model = require("../models/reaction_roles_message.js")
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://XtratoS:UfTMXyIAxTN6Xr3q@nbot-dg4ad.mongodb.net/rbot?retryWrites=true', { useNewUrlParser: true })

module.exports = async (bot, message, args) => {
    if (!args[0] || args[0] == "help") {
        let help = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Usage", "removerole <message_id> <role>/<emoji>")
        return message.channel.send(help).then(r => r.delete(30000))
    }
    if(!message.member.hasPermission("MANAGE_ROLES")){
        message.reply("You don't have permission").then(async m=>{
            await message.delete()
            return m.delete(15000)
        })
    }
    var message_id = args[0]
    if (!args[1]) {
        // remove the whole record that includes this message
        let removeall = new Discord.RichEmbed()
            .setColor("#FFA500")
            .addField("Warning", "You didn't provide a role/emoji to remove, would you like to remove all the roles/emojis bounded to this message?")
            .addField("Respone", "Type **Yes** to overwrite or anything else to Cancel")
            .setDescription("*This command will be automatically cancelled in 60 seconds*")
        msg = message.channel.send(removeall)
        const filter = m => m.author.id === message.author.id
        var response = await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
            if (!collected.first()) {
                msg.edit(new Discord.RichEmbed()
                    .setColor("#FF0000")
                    .addField("Failture", "Command timed out")
                ).then(m => m.delete(30000))
                return false
            }
            if (collected.first().content.toLowerCase() == "yes") {
                return true
            } else {
                msg.edit(new Discord.RichEmbed()
                    .setColor("#FFFF00")
                    .addField("Information", "Command Cancelled")
                ).then(m => m.delete(30000))
                return false
            }
        }).catch(r => { console.log(r) })
        if (!response) {
            return
        }
        reaction_message_model.deleteOne({
            messageID: message_id
        }, (err, rem) => {
            if (err) { console.log(err); return }
            if (!rem) {
                let noq = new Discord.RichEmbed()
                    .setColor("#F0FFF0")
                    .addField("Notification", "No roles were found for this message in the database to remove.")
                return message.channel.send(noq).then(r => r.delete(30000))
            } else {
                let done = new Discord.RichEmbed()
                    .setColor("#00FFF0")
                    .addField("Notification", `All roles/emojis on message with the id **${message_id}** were deleted from the database.`)
                return message.channel.send(done).then(r => r.delete(30000))
            }
        })
    } else {
        // remove only the specified emoji or corresponding role
        reaction_message_model.findOne({
            messageID: message_id
        }, async (err, rem) => {
            if (err) { console.log(err); return }
            if (!rem) {
                let noq = new Discord.RichEmbed()
                    .setColor("#F0FFF0")
                    .addField("Notification", "No roles were found in the database to remove.")
                return message.channel.send(noq).then(r => r.delete(30000))
            } else {
                // temp = JSON.parse(JSON.stringify(rem.roles))
                // remove the role from the roles object
                var success = false
                var reem
                for (emoji in rem.roles) {
                    if (args[1] == emoji || args[1] == rem.roles[emoji].name) {
                        reem = emoji
                        delete rem.roles[emoji]
                        success = true
                        // check if the roles object is now empty to remove the whole record
                        if (hutil.isEmpty(rem.roles)) {
                            reaction_message_model.deleteOne({
                                messageID: message_id
                            }, (err, rem2) => {
                                if (err) { console.log(err); return }
                            })
                        } else {
                            // if not empty just save the object after removing the role from it
                            reaction_message_model.updateOne({ messageID: message_id }, { $set: { roles: rem.roles } }).catch(err => {
                                console.log(err)
                            })
                        }
                    }
                }
                if (!success) {
                    let failture = new Discord.RichEmbed()
                        .setColor("#FF0000")
                        .addField("Failture", `Couldn't do it :cry:`)
                    return message.channel.send(failture)
                }
                role_channel = message.guild.channels.find(f => {
                    if (f.id == rem.channelID) {
                        return f
                    }
                })
                good_message = await role_channel.fetchMessage(message_id).catch(err => {
                    let embed = new Discord.RichEmbed()
                        .setColor("#FF0000")
                        .addField("Error", `Couldn't find message with the id ${message_id}`)
                    console.log(err)
                    return message.channel.send(embed)
                })
                reaction = await good_message.reactions.find(f => {
                    if (f.me == true && f.emoji.name == reem) {
                        return f
                    }
                })
                if (reaction) {
                    reaction.remove()
                }
                let done = new Discord.RichEmbed()
                    .setColor("#00FF00")
                    .addField("Success", "The designated role/emoji was deleted from the designated message on the database.")
                return message.channel.send(done).then(r => r.delete(30000))
            }
        })
    }
}