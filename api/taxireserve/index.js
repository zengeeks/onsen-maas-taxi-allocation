const http = require('https');
const uuid = require('uuid');

module.exports = function (context, req) {

	let userId = "";
	const json_mess = "";
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(json_mess)
		}
	};

	const send_url = "https://api.line.me/oauth2/v2.1/verify?id_token=" + req.body.userIdToken + "&client_id=" + process.env.LIFF_CHANNEL_ID;
	const client = http.request(send_url, options, (res) => {
		let resBody = '';
		res.on('data', (chunk) => { resBody += chunk; });
		res.on('end', () => {
			const resObj = JSON.parse(resBody);
			userId = resObj.sub;

			context.bindings.taxiReserveDocument = JSON.stringify({
				id: uuid.v4(),
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
				// status defaults to 200 */
				body: JSON.stringify({
					userId: userId,
					status: "success"
				})
			};
			
			context.done();
		});
	});
	client.on('error', (e) => {
		context.res = {
			status: 500,
			body: resBody + e.stack
		};
		context.done();
	});
	client.write(json_mess);
	client.end();
};