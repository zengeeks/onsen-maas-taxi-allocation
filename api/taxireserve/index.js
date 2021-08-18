const fetch = require('node-fetch');
const uuid = require('uuid');

module.exports = async function (context, req) {

	// LINE Login の id_token 検証にアクセスするパラメータを設定
	const send_url = "https://api.line.me/oauth2/v2.1/verify";
	const options = {
		method: 'POST',
		body: 'id_token=' + req.body.userIdToken + '&client_id=' + process.env.LIFF_CHANNEL_ID,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	};

	// LINE Login の id_token 検証を実行してユーザーIDを取得
	const response = await fetch(send_url, options);
	const data = await response.json();

	// Cosmos DB への保存
	context.bindings.taxiReserveDocument = JSON.stringify({
		id: uuid.v4(),
		userId: data.sub,
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
			userId: data.sub,
			status: "success"
		})
	};
};