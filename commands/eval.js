const Discord = require('discord.js');

function clean(text) {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

module.exports =
    async (bot, message, args) => {
        if (!args[1]) {
            return;
        }
        if(!message.member.hasPermission('ADMINISTRATOR')){
            return;
        }
        try {
            let input = args.splice(1).join(' ');
            let evaled = eval(input)
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
            evaled = clean(evaled)
            let response = new Discord.RichEmbed()
                .setColor("#FFFF00")
                .addField("📥", `\`\`\`js\n${input}\`\`\``)
            let l = evaled.length
            response
                .addField("📤", `\`\`\`js\n${evaled.substring(0, 1000)}\`\`\``)
            evaled = evaled.substring(1000)
            l = evaled.length
            while (l > 0) {
                response
                    .addField("\u200B", `\`\`\`js\n${evaled.substring(0, 1000)}\`\`\``)
                evaled = evaled.substring(1000)
                l = evaled.length
            }
            message.channel.send(response);
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`js\n${clean(err)}\n\`\`\``);
        }
    }