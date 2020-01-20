const conf     = require('./conf.js');
const Api      = require('./src/api/api.js');
const Discord  = require('./src/discord/bot.js');

Discord.start();
Api.start();
