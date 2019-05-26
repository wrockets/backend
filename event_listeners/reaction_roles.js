const Discord = require("discord.js");
const mongoose = require('mongoose');
const conf = require('../conf.js');
mongoose.connect(conf.mongodbs, { useNewUrlParser: true });
const reaction_message_model = require("../models/reaction_roles_message.js");

/**
 * @param {Discord.Client} bot discord client
 * @param {event} event raw event;
 * bot.on("raw", event => {}
 */
module.exports.run = async (bot, event) => {
    var guild_obj = bot.guilds.find(r => r.id == event.d.guild_id);
    var user_guild_member = await guild_obj.fetchMember(event.d.user_id).catch(err => console.log(err));
    if (user_guild_member.user.bot) {
        return
    }
    var message_id = event.d.message_id;
    // fetch data from database
    reaction_message_model.findOne({ messageID: message_id },
        async function (err, rec) {
            if (err) {
                console.log(err);
            }
            if (rec) {
                var emoji_ar = event.d.emoji.name;
                var role = rec.roles[emoji_ar];
                if (!role) {
                    return;
                }
                if (rec.channelID == event.d.channel_id && role) {
                    // make sure user isn't bot
                    if (user_guild_member.bot) {
                        return;
                    }
                    if (event.t == "MESSAGE_REACTION_ADD") {
                        // user_guild_member.send(`You got the role **${role["name"]}**`).catch(err=>{return})
                        user_guild_member.addRole(role["id"]).catch(err => console.log(err));
                    }
                    else if (event.t == "MESSAGE_REACTION_REMOVE") {
                        // user_guild_member.send(`Role **${role["name"]}** was removed`).catch(err => console.log(err))
                        user_guild_member.removeRole(role["id"]).catch(err => console.log(err));
                    }
                }
            }
        }
    )
}