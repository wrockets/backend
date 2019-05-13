const Discord = require('discord.js');
const fs = require('fs');
const path = './db/log_c.json';

module.exports =
    /**
     * Sends the content to the logging channel of the guild of the given guild_id if a logging channel exists in the db
     * @param {Discord.Client} bot 
     * @param {number} guild_id 
     * @param {Discord.RichEmbed} content 
     */
    function (bot, guild_id, content, type) {
        const errmsg = `Couldn't find the ${type} log channel for server ${guild_id}, please add the logging channel to avoid losing more logs.`;
        if (!fs.existsSync(path)) {
            console.log(errmsg);
            return;
        }
        var c = fs.readFileSync(path, 'utf8')
        if (!c || c === '')
            return;
        var data = JSON.parse(c);
        if (!data[guild_id] || !data[guild_id][type]) {
            console.log(errmsg);
            return;
        }
        // find the server
        var temp = bot.guilds.find(g => g.id === guild_id);
        // find the log channel of the server
        temp = temp.channels.find(c => c.id === data[guild_id][type]);
        if (!temp) {
            console.log(errmsg);
            return;
        }
        // send the content to the channel
        return temp.send(content);
    }