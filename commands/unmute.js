const fs = require('fs');
const Discord = require('discord.js');
const log = require('../actions/log.js');
const path = './db/muted_roles.json';

async function add_muted_roles(user) {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '{}');
    }
    var file = fs.readFileSync(path, 'utf8');
    var roles = JSON.parse(file);
    await user.addRoles(roles[user.id]).catch(err => console.log(`Couldn't add unmute roles back to ${user.displayName} in ${user.guild.id}\n${err}`));
    delete roles[user.id];
    fs.writeFileSync(path, JSON.stringify(roles));
    return true;
}

module.exports =
    async function (bot, message, args) {
        var rn = new Date()
        var member = message.mentions.members.first() || message.guild.members.find(m => m.id === args[1] || m.displayName === args[1]);
        if (!member) {
            console.log(`No Member`)
        }
        add_muted_roles(member);
        setTimeout(c => { member.removeRole(message.guild.roles.find(r => r.name.toLowerCase() === "mute")) }, 1000);
        var response = new Discord.RichEmbed()
            .setColor("#FFA500")
            .setDescription(
                `**ACTION:** Mute user\n**TARGET:** ${member} (${member.displayName}) (${member.id})\n` +
                `**EXECUTOR:** ${message.member} (${message.member.displayName}) (${message.member.id})\n` +
                `**DATE/TIME:** ${rn.getUTCFullYear()}-${rn.getUTCMonth() + 1}-${rn.getUTCDay()}, ${rn.getUTCHours()}:${rn.getUTCMinutes()}:${rn.getUTCSeconds()}`)
        log(bot, message.guild.id, response, 'mute')
    }