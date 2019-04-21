const mongoose = require("mongoose");

/**
 * role: [{emoji, role_id}, {emoji2, role_id2}]
 */
const Schema = mongoose.Schema({
    guildID: String,
    channelID: String,
    messageID: String,
    roles: {}
})

module.exports = mongoose.model("reaction_roles_message", Schema);