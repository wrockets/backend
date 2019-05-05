const reaction_bot = require('./reaction_roles.js');

module.exports = function (client) {
    client.on("raw", function (event) {
        const event_type = event.t;
        if ((event_type === "MESSAGE_REACTION_ADD" || event_type === "MESSAGE_REACTION_REMOVE")) {
            reaction_bot.run(client, event).catch(err => console.log(err));
        }
    });
}