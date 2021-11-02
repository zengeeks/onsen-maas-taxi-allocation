export interface TaxiReservation {
  id: string
  userId: string
  userName: string
  departurePlaceText: string
  arrivalPlaceText: string
  userPhoneNumber: string
  userNumberOfPassenger: number
  numberOfTickets: number
  reservationDatetimeText: string
  statusId: number
  latestUpdateDatetimeText: string
}
