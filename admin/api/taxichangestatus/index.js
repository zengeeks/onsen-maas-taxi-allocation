const Connection = require('tedious').Connection;
const TedRequest = require('tedious').Request;
const TYPES = require('tedious').TYPES;

module.exports = function (context, req) {
	const reservationId			 = req.body.reservationId;
	const reservationStatus		 = req.body.reservationStatus;

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
			queryDatabase();
		}
	});

	function queryDatabase() {
		const query = "UPDATE [dbo].[TaxiReservationTbl] SET ReservationStatus = @paramReservationStatus, LatestUpdateDatetime = @paramLatestUpdateDatetime WHERE ReservationId = @paramReservationId;";
		request = new TedRequest(query, function(err) {
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
		request.addParameter('paramReservationId', TYPES.Int, reservationId);
		request.addParameter('paramReservationStatus', TYPES.Int, reservationStatus);
		request.addParameter('paramLatestUpdateDatetime', TYPES.DateTime, date.toISOString());
		request.on('requestCompleted', function () {
			connection.close();
		});
		connection.execSql(request);
	}
};