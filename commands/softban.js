const Discord = require('discord.js');
module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed();
        if (!args[1] || args[1] === 'help') {
            response
                .setColor("#FFFF00")
                .addField("Usage", "softban <@mention_member/member_name/member_ID> (reason)")
            return message.channel.send(response)
        }
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            await message.reply("You don't have permissions");
            return message.delete();
        }
        if (!message.guild.me.hasPermission('BAN_MEMBERS')) {
            await message.reply("You don't have permissions");
            return message.delete();
        }
        var ban_member = message.mentions.members.first() || message.guild.members.find(u => u.id === args[1] || u.displayName === args[1] || u.user.name === args[1]);
        var ban_user
        if (ban_member)
            ban_user = ban_member.user;
        var reason = args.slice(2).join(' ');
        if (!reason)
            reason = "No reason provided!";
        var temp = new Discord.RichEmbed()
            .setColor("#FFFF00")
            .addField("Confirmation", `You are about to softban ${ban_member}`)
            .addField("Reason", reason)
            .addField("Decision", "Reply with 'y' to procceed or anything else to cancel")
            .setFooter("Automatically cancels in 60 seconds")
        await message.channel.send(temp);
        temp = await message.channel.awaitMessages(m => m.author.id === message.author.id, { time: 60000, maxMatches: 1 })
        if (!temp || temp.first().content.toLowerCase() !== 'y') {
            return message.channel.send("Command was cancelled")
        } else {
            // start of invite the user back to the server
            try {
                if (ban_member && ban_member.bannable) {
                    // create an invite to the first text channel and send it to the user
                    var inv = await message.guild.channels.find(c => c.type === 'text').createInvite({
                        temporary: true,
                        maxAge: 0,
                        maxUses: 0,
                        unique: false
                    }, "Reinvite softbanned user")
                    await ban_user.send('You have been softbanned, and now you are unbanned, this is an invite back to the server\n' + inv)
                }
            } catch (err) {
                console.log(err);
                temp
                    .setColor("#FF0000")
                    .addField("Error", `Couldn't reinvite ${ban_member} to the server`)
                return message.channel.send(temp);
            }
            // end of invite the user back to the server
            temp = new Discord.RichEmbed()
            // start of softban
            try {
                var unban_id = ban_member.id;
                console.log(ban_member);
                await ban_member.ban({
                    days: 7,
                    reason: reason
                });
                await setTimeout(st => { message.guild.unban(unban_id, "Softban removal") }, 20000)
                temp
                    .setColor("#FFA500")
                    .addField("Success", "Member was softbanned successfully");
            } catch (err) {
                console.log(err);
                temp
                    .setColor("#FF0000")
                    .addField("Error", `Couldn't ban ${ban_member}`)
                return message.channel.send(temp);
            }
            // end of softban
        }
    }