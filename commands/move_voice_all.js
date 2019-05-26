const Discord = require('discord.js')
module.exports = async function (bot, message, args) {
    // check for help
    if (!args[1] || args[1] == "help") {
        let help = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Usage", "moveall <voice_channel_id/voice_channel_name>")
        return message.channel.send(help)
    }
    // check if command issuer has perms
    if (!message.member.hasPermission("MOVE_MEMBERS")) {
        message.reply("You don't have permission").then(async function (m) {
            await message.delete()
            return m.delete(15000)
        })
    }
    // check if bot has perms
    if (!message.guild.me.hasPermission("MOVE_MEMBERS")) {
        message.reply("Bot doesn't have permission").then(async function (m) {
            await message.delete()
            return m.delete(15000)
        })
    }
    var voice_channel = bot.channels.find(c => c.id === args[1] || c.name === args[1])
    if (!voice_channel)
        return message.reply(`Couldn't find a VC with the id/name ${args[1]}`);
    if (!voice_channel.type === 'voice')
        return message.reply(`${args[1]} is not an id/name of a voice channel`);
    var voice_channels
    {
        voice_channels = bot.guilds.find(g => g.id === message.guild.id).channels.filter(c => c.type === 'voice');
    }
    voice_channels.array().forEach(channel => {
        let members = channel.members
        members.array().forEach(member => {
            member.setVoiceChannel(voice_channel)
        })
    });
}