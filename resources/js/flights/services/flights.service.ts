import type { Flight } from '../types'

type FlightItinerary = {
  departureCity: string
  arrivalCity: string
  hour: string
}

type SearchFlightParams = {
  searchs: number
  qtyPassengers: number
  adult: number
  itinerary: FlightItinerary[]
}

export async function searchFlights(search: SearchFlightParams): Promise<Flight[]> {
  try {
    const response = await fetch('/api/flights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(search),
    })

    if (!response.ok) {
      throw new Error('Failed on search flights')
    }

    const data: Flight[] = await response.json()
    return data
  }
  catch (error) {
    throw new Error(`An error occurred while searching flights: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
