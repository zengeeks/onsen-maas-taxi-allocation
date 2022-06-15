import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { CosmosClient } from '@azure/cosmos'

type Reservation = {
  id: string
  userId: string
  reservationStatus: string
}

const taxichangestatus: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  // TODO: Validate
  // req.body.reservationStatus

  try {
    const endpoint = <string>process.env.COSMOSDB_ENDPOINT
    const key = process.env.COSMOSDB_KEY
    const client = new CosmosClient({ endpoint, key })

    const { database } = await client
      .database(<string>process.env.COSMOSDB_DATABASE)
      .read()
    const { container } = await database
      .container(<string>process.env.COSMOSDB_CONTAINER)
      .read()
    const item = container.item(req.body.id, req.body.userId)
    const { resource: reservation } = await item.read()
    reservation.reservationStatus = req.body.reservationStatus
    const { resource: updatedReservation } =
      await container.items.upsert<Reservation>(reservation)

    if (!updatedReservation) {
      throw new Error("Can't retrieve updated reservation data")
    }

    context.res = {
      status: 200,
      body: {
        id: updatedReservation.id,
        userId: updatedReservation.userId,
        reservationStatus: updatedReservation.reservationStatus,
      },
    }
  } catch (e) {
    context.log('Error: ', e)
    if (e instanceof Error) {
      context.res = {
        status: 500,
        body: e.message,
      }
    }
    return
  }
}

export default taxichangestatus
