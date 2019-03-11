const client = require('./client.js').Client;

function tournaments(filter) {
	var gql = `
query TournamentQuery ($filter: TournamentPageFilter!) {
	tournaments(query: {
		filter: $filter
	}) {
		nodes {
			id
			name
			slug
			ownerId
			startAt
		}
	}
}`

	return client.Request(gql, {filter});
}

module.exports = tournaments;
