const conf = require('../conf.js');
const GQL  = require('silica-graphql-client');

const endpoint = 'https://api.smash.gg/gql/alpha';

const client = new GQL.Client(endpoint, {
	headers: {
		authorization: 'Bearer ' + conf.smashToken,
	},
});

module.exports.Client = client;
