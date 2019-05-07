const Discord = require('discord.js');
const fs = require('fs');
const path = './db/log_c.txt';

module.exports =
    /**
     * Sends the content to the logging channel of the guild of the given guild_id if a logging channel exists in the db
     * @param {Discord.Client} bot 
     * @param {number} guild_id 
     * @param {Discord.RichEmbed} content 
     */
    function (bot, guild_id, content) {
        let c = fs.readFileSync(path, 'utf8');
        if (!c || c === '')
            return;
        let data = JSON.parse(c);
        if (!data[guild_id])
            return;
        // find the server
        let temp = bot.guilds.find(g => g.id === guild_id);
        // find the log channel of the server
        temp = temp.channels.find(c => c.id === data[guild_id]);
        if (!temp) {
            console.log(`Couldn't find the log channel for server ${guild_id}, please add the logging channel to avoid losing more logs.`);
            return;
        }
        // send the content to the channel
        return temp.send(content);
    }