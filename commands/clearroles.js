const Discord = require("discord.js")
const reaction_message_model = require("../models/reaction_roles_message.js")
const mongoose = require('mongoose');
const conf = require('../conf.js');
mongoose.connect(conf.mongodbs, { useNewUrlParser: true })

/**
 * Clears all the roles on any message in the server
 */
module.exports = async (bot, message, args) => {
    if (args[0] == "help"){
        let help = new Discord.RichEmbed()
        .setColor("#FFFF00")
        .addField("Usage", "clearroles")
        .addField("More info", "Clears all the roles on any message in the server.")
        return message.channel.send(help).then(r => r.delete(30000))
    }
    if(!message.member.hasPermission("MANAGE_ROLES")){
        message.reply("You don't have permission").then(async m=>{
            await message.delete()
            return m.delete(15000)
        })
    }
    reaction_message_model.deleteMany({
        guildID: message.guild.id
    },(err, rem) => {
        if(err) {console.log(err); return}
        if(!rem){
            let noq = new Discord.RichEmbed()
            .setColor("#F0FFF0")
            .addField("Notification", "No roles were found in the database to remove.")
            return message.channel.send(noq).then(r => r.delete(30000))
        }else{
            let done = new Discord.RichEmbed()
            .setColor("#00FFF0")
            .addField("Notification", "All roles on all messages were deleted from the database.")
            return message.channel.send(done).then(r => r.delete(30000))
        }
    })
}