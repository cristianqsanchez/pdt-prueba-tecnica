type LocationID = {
  departureCity: string
  arrivalCity: string
}

export type Flight = {
  dateOfDeparture: string
  timeOfDeparture: string
  dateOfArrival: string
  timeOfArrival: string
  marketingCarrier: string
  companyName: string
  flightOrtrainNumber: string
  locationId: LocationID
}
