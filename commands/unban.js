const Discord = require('discord.js');
const log = require('../actions/log.js');

module.exports =
    async function (bot, message, args) {
        var rn = new Date();
        var response = new Discord.RichEmbed();
        if (!args[1] || args[1] === 'help') {
            response
                .setColor("#FF0000")
                .addField("Usage", "unban <member_ID> (reason)");
            return message.channel.send(response);
        }
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            await message.reply("You don't have permissions");
            return message.delete();
        }
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            await message.channel.send(`${message.guild.me} doesn't have permissions`);
            return message.delete();
        }
        var banned_member = await bot.fetchUser(args[1]).catch(function (err) {
            console.log(err);
            return null;
        });
        var temp = new Discord.RichEmbed()
        if (!banned_member) {
            temp
                .setColor("#FF0000")
                .addField("Error", `Couldn't fetch user ${args[1]}, please provide a user ID to unban`);
            return message.channel.send(temp);
        }
        var reason = args.slice(2).join(' ');
        if (!reason || reason === '') {
            reason = 'No reason given!';
        }
        try {
            await message.guild.unban(banned_member, { reason: reason })
            temp
                .setColor("#00FF00")
                .addField("Success!", `${banned_member.tag} has been unbanned`)
            message.channel.send(temp);
        } catch (err) {
            console.log(err);
            temp
                .setColor("#FF0000")
                .addField("Error", `Couldn't unban ${banned_member}, please provide a proper user ID to unban`);
            return message.channel.send(temp);
        }
        // log the unban
        var log_embed = new Discord.RichEmbed()
            .setColor("#50FF50")
            .setDescription(`**ACTION:** Unban user\n**REASON:** ${reason}\n**TARGET:** ${banned_member.tag}\n**EXECUTER:** ${message.member}`)
            .setFooter(`DATE/TIME: ${rn.getUTCFullYear()}-${rn.getUTCMonth() + 1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`);
        log(bot, message.guild.id, log_embed, 'ban')
        //end of log
    }