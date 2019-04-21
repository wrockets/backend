const Discord = require("discord.js")

module.exports = async (bot, message, args) => {
    if (!args[0] || args[0] == "help"){
        let help = new Discord.RichEmbed()
        .setColor("#FFFF00")
        .addField("Usage", "makemessage <channe_id> <message content>")
        return message.channel.send(help)
    }
    if(!message.member.hasPermission("MANAGE_ROLES")){
        message.reply("You don't have permission").then(async m=>{
            await message.delete()
            return m.delete(15000)
        })
    }
    channel = message.guild.channels.find(f=>{
        if(f.id == args[0])
            return f
    })
    msg = message.toString().split(/ +/g).slice(2).join(" ")
    if(msg.startsWith("image")){
        msg = msg.toString().split(/ +/g).slice(1).join(" ")
        return channel.send(msg.toString().split(/ +/g).slice(1).join(" "), {files: [msg.toString().split(/ +/g).slice(0,1).join(" ")]}).then(m=>{
            message.delete()
        })
    }else{
        return channel.send(msg).then(m=>{
            message.delete()
        })
    }
}