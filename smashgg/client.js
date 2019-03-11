const conf    = require('../conf.js');
const GQL = require('gql-client');

const endpoint = 'https://api.smash.gg/gql/alpha';

const client = new GQL.Client(endpoint, {
	headers: {
		authorization: 'Bearer ' + conf.smashToken,
	},
});

module.exports.Client = client;
