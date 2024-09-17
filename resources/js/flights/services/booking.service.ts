type Itinerary = {
  origin: string
  destination: string
  departure_time: string
  arrival_time: string
}

type Booking = {
  origin: string
  destination: string
  departure_time: string
  itineraries: Itinerary[]
}

export async function storeFlightBooking(booking: Booking) {
  try {
    const response = await fetch('/api/reserves', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(booking),
    })

    if (!response.ok) {
      throw new Error('Something was wrong on booking your flight')
    }

    return response.ok
  } catch (error) {
    throw new Error(`An error occurred while booking your flight: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
