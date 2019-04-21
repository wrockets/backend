const tournaments = require('./commands/tournaments.js');
const ping = require('./commands/ping.js');
const roles = require('./commands/roles.js');
const addrole = require('./commands/addrole.js');
const removerole = require('./commands/removerole.js');
const clearroles = require('./commands/clearroles.js');
const makemessage = require('./commands/makemessage.js');
const editmessage = require('./commands/editmessage.js');



module.exports = {
	tournaments,
	ping,
	roles,
	addrole,
	removerole,
	clearroles,
	makemessage,
	editmessage
}
