const { CosmosClient } = require("@azure/cosmos");

module.exports = async function (context, req) {
	// TODO: Validate
	// req.body.reservationStatus

	try {
		const endpoint = process.env.COSMOSDB_ENDPOINT;
		const key = process.env.COSMOSDB_KEY;
		const client = new CosmosClient({ endpoint, key });

		const { database } = await client.databases.createIfNotExists({ id: process.env.COSMOSDB_DATABASE });
		const { container } = await database.containers.createIfNotExists({ id: process.env.COSMOSDB_CONTAINER });
		const item = container.item(req.body.id, req.body.userId);
		const { resource: reservation } = await item.read();
		reservation.reservationStatus = req.body.reservationStatus;
		const { resource: updatedReservation } = await container.items.upsert(reservation);

		context.res = {
			status: 200,
			body: "Taxi reservation data is inserted to DB."
		};
	} catch (e) {
		context.log('Error: ', e);
		context.res = {
			status: e.code,
			body: e.message
		}
		return;
	}
};