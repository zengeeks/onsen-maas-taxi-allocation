import { TaxiReservationResponse } from './TaxiReservationResponse'

// const places = ["", "観光会館", "○○駅", "○○温泉", "○○カフェ"];
// const reservation_status = ["", "受付", "手配中", "手配済み", "キャンセル済"];

export class TaxiReservation {
  _id: string
  _userId: string
  _userName: string
  _departurePlace: string
  _arrivalPlace: string
  _userPhoneNumber: string
  _userNumberOfPassenger: number
  _numberOfTickets: number
  _reservationDatetime: string
  _status: number
  _updated: string

  constructor(response: TaxiReservationResponse) {
    this._id = response.id
    this._userId = response.userId
    this._userName = response.userName
    this._departurePlace = response.departurePlace
    this._arrivalPlace = response.arrivalPlace
    this._userPhoneNumber = response.userPhoneNumber
    this._userNumberOfPassenger = response.userNumberOfPassenger
    this._numberOfTickets = response.numberOfTickets
    this._reservationDatetime = response.reservationDatetime
    this._status = response.reservationStatus
    this._updated = response.latestUpdateDatetime
  }

  get id() {
    return this._id
  }

  get userId() {
    return this._userId
  }

  get userName() {
    return this._userName
  }

  get userPhoneNumber() {
    return this._userPhoneNumber
  }

  get departurePlace() {
    return this._departurePlace
  }

  get arrivalPlace() {
    return this._arrivalPlace
  }

  get numberOfTickets() {
    return this._numberOfTickets
  }

  get userNumberOfPassenger() {
    return this._userNumberOfPassenger
  }

  get reservationDatetime() {
    return this._reservationDatetime
  }

  get status() {
    return this._status
  }

  get updated() {
    return this._updated
  }

  isRequested() {
    return this._status == 1
  }

  isAllocating() {
    return this._status == 2
  }

  isAllocated() {
    return this._status == 3
  }

  isCanceled() {
    return this._status == 4
  }

  updateStatus(status: number) {
    this._status = status
  }
}
