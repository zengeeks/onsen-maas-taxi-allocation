const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
	try {
		const endpoint = process.env.COSMOSDB_ENDPOINT;
		const key = process.env.COSMOSDB_KEY;
		const client = new CosmosClient({ endpoint, key });

		const { database } = await client.database(process.env.COSMOSDB_DATABASE).read();
		const { container } = await database.container(process.env.COSMOSDB_CONTAINER).read();
		const { resources } = await container.items
			.query({
				query: "SELECT c.id, c.userId, c.userName, c.departurePlace, c.arrivalPlace, c.userPhoneNumber, c.userNumberOfPassenger, c.userPassengers, c.numberOfTickets, c.reservationStatus, c.reservationDatetime, c.latestUpdateDatetime FROM c WHERE @fromDate <= c.reservationDatetime and c.reservationDatetime < @toDate ORDER BY c.id DESC",
				parameters: [
					{
						name: "@fromDate",
						value: req.query.fromDate
					},
					{
						name: "@toDate",
						value: req.query.toDate
					}
				]
			})
			.fetchAll();

		context.res = {
			status: 200,
			body: resources
		};
	} catch (e) {
		context.log('Error: ', e);
		context.res = {
			status: 500,
			body: e.message
		}
		return;
	}
};