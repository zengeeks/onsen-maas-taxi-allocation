const placesToDisplay = ['', '観光会館', '○○駅', '○○温泉', '○○カフェ']

const reservationStatusToDisplay = [
  '',
  '受付',
  '手配中',
  '手配済み',
  'キャンセル済',
]

export const reservationStatuses = {
  accepted: 1,
  allocating: 2,
  allocated: 3,
  canceled: 4,
}

export const placeNameToDisplay = (placeId: number): string => {
  return placesToDisplay[placeId]
}

export const statusToDisplay = (statusId: number): string => {
  return reservationStatusToDisplay[statusId]
}

export const isStatusRequested = (statusId: number): boolean => {
  return statusId == reservationStatuses['accepted']
}

export const isStatusAllocating = (statusId: number): boolean => {
  return statusId == reservationStatuses['allocating']
}

export const isStatusAllocated = (statusId: number): boolean => {
  return statusId == reservationStatuses['allocated']
}

export const isStatusCanceled = (statusId: number): boolean => {
  return statusId == reservationStatuses['canceled']
}