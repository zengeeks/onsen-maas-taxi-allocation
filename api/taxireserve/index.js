const Connection = require('tedious').Connection;
const TedRequest = require('tedious').Request;
const TYPES = require('tedious').TYPES;
const http = require('https');
module.exports = function (context, req) {
	const userIdToken			 = req.body.userIdToken;
	const userName				 = req.body.userName;
	const departurePlace		 = req.body.departurePlace;
	const arrivalPlace			 = req.body.arrivalPlace;
	const userPhoneNumber		 = req.body.userPhoneNumber;
	const userNumberOfPassenger	 = req.body.userNumberOfPassenger;
	const userPassengers		 = req.body.userPassengers;
	const numberOfTickets		 = req.body.numberOfTickets;
	const reservationDatetime	 = req.body.reservationDatetime;
	
	let userId = "";
	const json_mess = "";
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(json_mess)
		}
	};
	
	const send_url = "https://api.line.me/oauth2/v2.1/verify?id_token=" + userIdToken + "&client_id=" + process.env.LIFF_CHANNEL_ID;
	const client = http.request(send_url, options, (res) => {
		let resBody = '';
		res.on('data', (chunk) => { resBody += chunk; });
		res.on('end', () => {
			const resObj = JSON.parse(resBody);
			userId = resObj.sub;
					
			const config = {
				server: process.env.DB_CONNECT_SERVER_NAME,
				authentication: {
					type: 'default',
					options: {
						userName: process.env.DB_CONNECT_USER,
						password: process.env.DB_CONNECT_PASS,
					}
				},
				options: {
					encrypt:  true, 
					database: process.env.DB_CONNECT_DB_NAME
				}  
			};
			const connection = new Connection(config);
			connection.on('connect', function(err) {
				const mess_body  = new Object();
				if (err) {
					mess_body.status = "error";
					mess_body.message = err.stack;
					context.res = {
							status: 500,
							body: JSON.stringify(mess_body)
					};
					context.done();
				}
				else{
					const query = "INSERT INTO [dbo].[TaxiReservationTbl] (UserId, UserName, DeparturePlace, ArrivalPlace, UserPhoneNumber, UserNumberOfPassenger, UserPassengers, NumberOfTickets, ReservationStatus, ReservationDatetime, LatestUpdateDatetime) VALUES (@paramUserId, @paramUserName, @paramDeparturePlace, @paramArrivalPlace, @paramUserPhoneNumber, @paramUserNumberOfPassenger, @paramUserPassengers, @paramNumberOfTickets, @paramReservationStatus, @paramReservationDatetime, @paramLatestUpdateDatetime);";
					const request = new TedRequest(query, function(err) {
						let mess_body  = new Object();
						if (err) {
							mess_body.status = "error";
							mess_body.message = err.stack;
							context.res = {
									status: 500,
									body: JSON.stringify(mess_body)
							};
							context.done();
						}
						else{
							mess_body.status = "success";
							mess_body.message = "Taxi reservation data is inserted to DB.";
							context.res = {
									status: 200,
									body: JSON.stringify(mess_body)
							};
							context.done();
						}
					});
					const date = new Date();
					request.addParameter('paramUserId', TYPES.NVarChar, userId);
					request.addParameter('paramUserName', TYPES.NVarChar, userName);
					request.addParameter('paramDeparturePlace', TYPES.NVarChar, departurePlace);
					request.addParameter('paramArrivalPlace', TYPES.NVarChar, arrivalPlace);
					request.addParameter('paramUserPhoneNumber', TYPES.NVarChar, userPhoneNumber);
					request.addParameter('paramUserNumberOfPassenger', TYPES.Int, Number(userNumberOfPassenger));
					request.addParameter('paramUserPassengers', TYPES.NVarChar, userPassengers);
					request.addParameter('paramNumberOfTickets', TYPES.Int, Number(numberOfTickets));
					request.addParameter('paramReservationStatus', TYPES.Int, 1);
					request.addParameter('paramReservationDatetime', TYPES.DateTime, new Date(reservationDatetime));
					request.addParameter('paramLatestUpdateDatetime', TYPES.DateTime, date.toISOString());
					request.on('requestCompleted', function () {
						connection.close();
					});
					connection.execSql(request);
				}
			});
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