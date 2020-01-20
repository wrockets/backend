const SmashGG = require('../../smashgg/smash.js');
const DT      = require('luxon').DateTime;

function tournamentsCommand(msg, args) {
	SmashGG.Tournaments({
		ownerId: 394032,
		afterDate: Math.floor(Date.now() / 1000)
	}).then(function(data) {
		var str = "Upcoming Tournaments:";
		var tournaments = data.tournaments.nodes || [];
		var listing = tournaments.slice(0,3).map(function(tourney) {
			var start = DT.fromSeconds(tourney.startAt).setZone('America/New_York');
			return start.toFormat("LLLL d, HH:mm ZZZZ: ") +
				"**" + tourney.name + "**: " +
				"<https://smash.gg/" + tourney.slug + ">";
		})

		if (listing.length > 0)
			msg.reply(str + "\n" + listing.join("\n"));
		else
			msg.reply("No upcoming tournaments");
	}).catch(function(error) {
		msg.reply("An error occurred: " + JSON.stringify(error));
	})
}

module.exports = tournamentsCommand;
