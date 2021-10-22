const Connection = require('tedious').Connection;
const TedRequest = require('tedious').Request;
const TYPES = require('tedious').TYPES;

module.exports = function (context, req) {
	const fromDate = req.body.fromDate;
	const toDate	 = req.body.toDate;
	
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
		const arr = [];
		const query = "SELECT ReservationId, UserId, UserName, DeparturePlace, ArrivalPlace, UserPhoneNumber, UserNumberOfPassenger, UserPassengers, NumberOfTickets, ReservationStatus, ReservationDatetime, LatestUpdateDatetime FROM [dbo].[TaxiReservationTbl] WHERE ( ReservationDatetime BETWEEN @paramFromDate AND @paramToDate ) ORDER BY ReservationId DESC";
		const request = new TedRequest(query, function(err) {
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
				context.res = {
						status: 200,
						body: JSON.stringify(arr)
				};
				context.done();
			}
		});
		request.addParameter('paramFromDate', TYPES.DateTime, fromDate);
		request.addParameter('paramToDate', TYPES.DateTime, toDate);
		request.on('row', function(columns) {
			const mess_body  = new Object();
			mess_body.reservationId			= columns[0].value;
			mess_body.userId				= columns[1].value;
			mess_body.userName				= columns[2].value;
			mess_body.departurePlace		= columns[3].value;
			mess_body.arrivalPlace			= columns[4].value;
			mess_body.userPhoneNumber		= columns[5].value;
			mess_body.userNumberOfPassenger = columns[6].value;
			mess_body.userPassengers		= columns[7].value;
			mess_body.numberOfTickets		= columns[8].value;
			mess_body.reservationStatus		= columns[9].value;
			mess_body.reservationDatetime	= columns[10].value;
			mess_body.latestUpdateDatetime	= columns[11].value;
			arr.push(mess_body);
		});

		request.on('requestCompleted', function () {
			connection.close();
		});
		connection.execSql(request);
	}
};