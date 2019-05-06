module.exports = function (client) {
    client.on('message', function (msg) {
        if (msg.content.startsWith(conf.commandPrefix)) {
            var args = Args(msg.content);
            var cmd = args[0].substring(conf.commandPrefix.length);
            if (commands[cmd])
                commands[cmd](client, msg, args);
            else
                msg.reply("Sorry, I don't know that command");
        }
    });
}