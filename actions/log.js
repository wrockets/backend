const fs = require('fs');
const path = './db/log_c.txt';

module.exports = function (bot, guild_id, content) {
    let data = JSON.parse(fs.readFileSync(path));
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