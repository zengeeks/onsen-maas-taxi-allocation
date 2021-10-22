CREATE TABLE TaxiReservationTbl (
	ReservationId		int IDENTITY NOT NULL PRIMARY KEY,
	UserId			nvarchar(64),
	UserName		nvarchar(256),
	DeparturePlace		nvarchar(8),
	ArrivalPlace		nvarchar(8),
	UserPhoneNumber		nvarchar(16),
	UserNumberOfPassenger	int,
	UserPassengers		nvarchar(256),
	NumberOfTickets		int,
	ReservationStatus	int,
	ReservationDatetime	datetime,
	LatestUpdateDatetime	datetime
)