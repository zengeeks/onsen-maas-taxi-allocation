import { AzureFunction, Context, HttpRequest } from '@azure/functions'
import { v4 } from 'uuid';
import fetch from 'node-fetch';

const taxireserve: AzureFunction = async function (context, req) {

	let userId = "";

	// LINE Login の id_token 検証（成功時は userID をセット）
	const idTokenEndpoint = "https://api.line.me/oauth2/v2.1/verify";
	const idTokenParams = new URLSearchParams();
	idTokenParams.append('id_token', req.body.userIdToken);
	idTokenParams.append('client_id', process.env.LINE_LOGIN_CHANNEL_ID as string);

	try {
		const response = await fetch(idTokenEndpoint, { method: 'POST', body: idTokenParams });
		const data = await response.json();
		if (!response.ok) {
			throw new Error(`LINE ID Token API Error: ${data.error} - ${data.error_description}`);
		}
		userId = data.sub;
	} catch (e) {
		context.log('Error: ', e);
		if (e instanceof Error) {
			context.res = {
				status: 500,
				body: e.message
			}
		}
		return;
	}

	// Cosmos DB への保存
	context.bindings.taxiReserveDocument = JSON.stringify({
		id: v4(),
		userId: userId,
		userName: req.body.userName,
		departurePlace: req.body.departurePlace,
		arrivalPlace: req.body.arrivalPlace,
		userPhoneNumber: req.body.userPhoneNumber,
		userNumberOfPassenger: req.body.userNumberOfPassenger,
		userPassengers: req.body.userPassengers,
		numberOfTickets: req.body.numberOfTickets,
		reservationStatus: 1,
		reservationDatetime: new Date(req.body.reservationDatetime),
		latestUpdateDatetime: new Date().toISOString()
	});

	context.res = {
		body: JSON.stringify({
			userId: userId,
			status: "success"
		})
	};
};

export default taxireserve;