const Discord = require('discord.js');
const log = require('../actions/log.js');

module.exports =
    async function (bot, message, args) {
        var rn = new Date();
        var response = new Discord.RichEmbed();
        if (!args[1] || args[1] === 'help') {
            response
                .setColor("#FF0000")
                .addField("Usage", "ban <mention_member/member_name/member_ID> (reason)");
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
        var member = message.mentions.members.first() || message.guild.members.find(m => m.id === args[1] || m.displayName === args[1] || m.user.name === args[1]);
        var ban_user = member.user;
        if (!member) {
            return message.reply(`Failed to find member ${args[1]}`);
        }
        if (!member.bannable) {
            return message.reply(`${message.guild.me} can't ban this member`);
        }
        // start of normal ban
        var reason = args.slice(2).join(' ');
        if (!reason || reason === '') {
            reason = "No reason provided!";
        }
        var temp = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Confirmation", `You are about to ban ${member}`)
            .addField("Reason", reason)
            .addField("Decision", "Reply with 'y' to procceed or anything else to cancel")
            .setFooter("Automatically cancels in 60 seconds")
        await message.channel.send(temp);
        temp = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 60000, maxMatches: 1 })
        if (!temp || temp.first().content.toLowerCase() !== 'y') {
            return message.channel.send("Command was cancelled")
        } else {
            temp = new Discord.RichEmbed()
            try {
                await member.ban({ reason: reason });
                temp
                    .setColor("#FFA500")
                    .addField("Success", "Member was banned successfully");
            } catch (err) {
                console.log(err);
                temp
                    .setColor("#FF0000")
                    .addField(`Error", "Couldn't ban ${member}`)
            }
            message.channel.send(temp);
        }
        // end of normal ban
        // log the ban
        var log_embed = new Discord.RichEmbed()
            .setColor("#FFA500")
            .setDescription(`**ACTION:** Ban user\n**REASON:** ${reason}\n**TARGET:** ${ban_user.tag}\n**EXECUTER:** ${message.member}`)
            .setFooter(`DATE/TIME: ${rn.getUTCFullYear()}-${rn.getUTCMonth() + 1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`);
        log(bot, message.guild.id, log_embed, 'ban');
        //end of log
    }