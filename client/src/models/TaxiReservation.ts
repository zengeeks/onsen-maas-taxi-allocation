export interface TaxiReservation {
  displayName: string
  userId: string
  taxiUserName: string
  taxiUserPhoneNumber: string
  taxiNumberOfPassenger: string
  taxiPassengers: string
  isMessageWindow: boolean
  isTicketMessageWindow: boolean
  textMessageWindow: string
  selectedDeparturePlace: string
  selectedArrivalPlace: string
  selectedTicketNumber: number
  tickets: Ticket[]
  places: Place[]
}

interface Place {
  id: string
  name: string
}

interface Ticket {
  number: number
}
