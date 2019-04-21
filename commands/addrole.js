const Discord = require("discord.js")
const reaction_message_model = require("../models/reaction_roles_message.js")
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://XtratoS:UfTMXyIAxTN6Xr3q@nbot-dg4ad.mongodb.net/rbot?retryWrites=true', { useNewUrlParser: true })

/**
 * Adds a new role to any message in the server
 */
module.exports = async (bot, message, args) => {
    // check for help
    if (!args[2] || args[0] == "help") {
        let help = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Usage", "addemo <message_id> <emote> <role>")
            .addField("More info", "Adds a new role to any message in the server.")
        return message.channel.send(help).then(r => r.delete(30000))
    }
    // check if command issuer has perms
    if(!message.member.hasPermission("MANAGE_ROLES")){
        message.reply("You don't have permission").then(async m=>{
            await message.delete()
            return m.delete(15000)
        })
    }
    // check if bot has perms
    if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
        noperm = new Discord.RichEmbed().setColor("#FF0000").addField("Error", "The bot currently doesn't have permission to add or remove roles from people, please give the bot permission before adding reaction roles on messages.")
        return message.reply(noperm).then(r => r.delete(30000))
    }
    // set variables for easier access
    var message_id = args[0]
    var emoji = args[1]
    var role = message.mentions.roles.first()
    var channel_id
    // message placeholder
    var msg
    // RichEmbed placeholder
    let clean = new Discord.RichEmbed()
    // start looking for the message with the specified id, in order to react to it with the added emoji
    let channels = message.guild.channels
    channels = channels.first(channels.array().length)
    // channels is now an arrray of all the channels in this server
    let l = channels.length
    let i
    // now keep looping through the text channels and try to fetch the message
    for (i = 0; i < l; i++) {
        if (channels[i].type == "text") {
            good_message = await channels[i].fetchMessage(message_id).catch(err => { })
            // once message is found, react to it with the given emoji
            if (good_message) {
                await good_message.react(emoji).catch(err => { })
                channel_id = channels[i].id
            }
        }
    }
    // if no role was mentioned in the command call
    if (!role) {
        return message.channel.send(
            clean
                .setColor("#FF0000")
                .addField("Error", "No roles were mentioned in your command, please mention the role to add.")
        ).then(r => r.delete(30000))
    }
    // check if there's an emoji already bound to that message with a role.
    reaction_message_model.findOne({
        messageID: message_id
    }, async (err, reaction_message) => {
        msg = await message.reply("Loading...")
        if (err) console.log(err)
        // create a new object of the model to add it to the database
        if (!reaction_message) {
            const new_reaction_message = new reaction_message_model({
                guildID: message.guild.id,
                channelID: channel_id,
                messageID: message_id,
                roles: {}
            })
            new_reaction_message.roles[emoji] = {}
            new_reaction_message.roles[emoji]["name"] = role.name
            new_reaction_message.roles[emoji]["id"] = role.id
            new_reaction_message.save().catch(err => console.log(err))
        } else {
            // check if the same emote we're trying to add already exists in the database
            if (emoji in reaction_message.roles) {
                const filter = m => m.author.id === message.author.id
                // ask the user if they want to overwrite the current role that's bounded to this emoji in the database
                let overwrite = new Discord.RichEmbed()
                    .setColor("#FFA500")
                    .addField("Warning", `The emote ${emoji} was already found in the database on the mentioned message for the role **${role.name}**, Would you like to overwrite it?`)
                    .addField("Respone", "Type **Yes** to overwrite or anything else to Cancel")
                    .setDescription("*This command will be automatically cancelled in 60 seconds*")
                msg.edit(overwrite)
                // await for the user's reply for 60 seconds.
                var eternity = await message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
                    if (!collected.first()) {
                        msg.edit(clean.setColor("#FF0000").addField("Failture", "Command Timed Out")).then(m => m.delete(30000))
                        return false
                    } else {
                        if (collected.first().content.toLowerCase() == "yes") {
                            msg.edit(new Discord.RichEmbed().setColor("#F0FFFA").addField("Information", "Emote will be overwritten, please wait"))
                            return true
                        } else {
                            msg.edit(clean.setColor("#FFFF00").addField("Information", "Command Cancelled.")).then(m => m.delete(30000))
                            return false
                        }
                    }
                }).catch(r => { msg.edit(clean.setColor("#FFFF00").addField("Information", "Command Cancelled.")).then(m => m.delete(30000)); console.error; return false })
                if (!eternity) {
                    return
                }
            }
            // create a new object for the new emote, then add it to the roles object.
            var temp = JSON.parse(JSON.stringify(reaction_message.roles))
            temp[emoji] = {}
            temp[emoji]["name"] = role.name
            temp[emoji]["id"] = role.id
            reaction_message.roles = temp
            // save the document to the database
            reaction_message.save().catch(err => console.log(err))
            let done = new Discord.RichEmbed()
            .setColor("#00FF0F")
            .addField("Success","Emote has been successfully added, use the command **roles** to view all the emojis/roles bounded to messages in the server.")
            return await msg.edit(done).then(m => m.delete(30000))
        }
    })
}