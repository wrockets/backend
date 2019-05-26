const Discord = require("discord.js")

module.exports = async function (bot, message, args) {
    if (!args[2] || args[1] == "help") {
        let help = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Usage", "makemessage <channe_id> <message_content>")
        return message.channel.send(help)
    }
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
        message.reply("You don't have permission").then(async m => {
            await message.delete()
            return m.delete(15000)
        })
    }
    channel = message.guild.channels.find(c => c.id === args[1] || c.name === args[1]);
    msg = message.toString().split(/ +/g).slice(2).join(" ")
    if (msg.startsWith("image")) {
        msg = msg.toString().split(/ +/g).slice(1).join(" ")
        return channel.send(msg.toString().split(/ +/g).slice(1).join(" "), { files: [msg.toString().split(/ +/g).slice(0, 1).join(" ")] }).then(m => {
            message.delete()
        })
    } else {
        return channel.send(msg).then(m => {
            message.delete()
        })
    }
}