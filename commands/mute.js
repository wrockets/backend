const fs = require('fs');
const ms = require('ms');
const Discord = require('discord.js');
const log = require('../actions/log.js');
const unmute = require('./unmute.js');
const path = './db/muted_roles.json';

/**
 * creates a mute role if it doesn't exist
 * @param {Guild} guild guild object
 * @returns {Role} Created or already existing Mute Role Object
 */
async function get_mute_role(guild) {
    var mute_role = guild.roles.find(r => r.name.toLowerCase() === "mute");
    // create the mute role if it doesn't exist
    if (!mute_role) {
        // start of create role
        await guild
            .createRole({
                name: "Mute",
                color: "#FF0000"
            })
            .catch(err => console.log(`Couldn't create role "mute" for guild "${guild.name}" (${guild.id})\n${err}`));
        mute_role = guild.roles.find(r => r.name === "Mute");
        var text_channels = guild.channels.filter(c => c.type === "text")
        var voice_channels = guild.channels.filter(c => c.type === "voice")
        await mute_role
            .setPermissions(['VIEW_CHANNEL', 'SPEAK'])
            .catch(err => console.log(err));
        text_channels.forEach(channel => {
            channel.overwritePermissions(mute_role, {
                'SEND_MESSAGES': false,
                'ADD_REACTIONS': false
            })
        });
        voice_channels.forEach(channel => {
            channel.overwritePermissions(mute_role, {
                'SPEAK': false
            })
        })
        // end of create role
    }
    return mute_role;
}

/**
 * Saves the roles of the user to a file then removes them
 * @param {user} user user object to save roles for
 */
async function save_muted_roles(user) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }
    var file = fs.readFileSync(path, 'utf8');
    var roles = JSON.parse(file);
    roles[user.id] = [];
    roles_array = user.roles.array().splice(1);
    roles_array.forEach(async role => {
        roles[user.id].push(role.id)
    });
    await user.removeRoles(roles_array);
    fs.writeFileSync(path, JSON.stringify(roles));
}

module.exports =
    async function (bot, message, args) {
        var response = new Discord.RichEmbed()
        if (!args[1] || args[1] === 'help') {
            response
                .setColor("#FFFF00")
                .addField("Usage", "mute <user> (period)");
            return message.channel.send(response);
        }
        if (!message.member.hasPermission("MANAGE_ROLES")) {
            await message.delete();
            return message.reply("You don't have permission");
        }
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) {
            await message.delete();
            return message.reply("Bot doesn't have permission");
        }
        var rn = new Date();
        var member = message.mentions.members.first() || message.guild.members.find(m.id === args[1] || m.displayName === args[1]);
        if (!member) {
            console.log(`Couldn't find member ${args[1]} in server ${message.guild}`)
            response
                .setColor("#FF0000")
                .addField("Error", `Couldn't find member ${args[1]} in this server`);
            return message.channe.send(response);
        }
        var mute_role = await get_mute_role(message.guild);
        await save_muted_roles(member);
        await member.addRole(mute_role).catch(err => console.log(`Couldn't add role\n${err}`));
        response
            .setColor("#FFA500")
            .setDescription(
                `**ACTION:** Mute user\n**TARGET:** ${member} (${member.displayName}) (${member.id})\n` +
                `**EXECUTER:** ${message.member} (${message.member.displayName}) (${message.member.id})\n`)
            .setFooter(`DATE/TIME: ${rn.getUTCFullYear()}-${rn.getUTCMonth() + 1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`);
        if (args[2] && ms(args[2])) {
            setTimeout(function () {
                // copy the args to a new array
                var unmute_args = JSON.parse(JSON.stringify(args));
                // replace the command name
                unmute_args[0].replace('mute', 'unmute');
                // get the new message object and replace the command name in the content
                temp = message.content.split(' ');
                temp[0].replace('mute', 'unmute');
                message.content = temp.join(' ');
                // excute the unmute command
                unmute(bot, message, unmute_args);
                response.setDescription(response.description + `**DURATION:** ${ms(ms(args[2]), { long: true })}\n`)
            }, ms(args[2]));
        }
        log(bot, message.guild.id, response, 'mute')
    }