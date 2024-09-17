type AirportApiDTO = {
  id: number
  name: string
  city: string
  country: string
  iata: string
  created_at: string
  updated_at: string
}

export type Airport = {
  id: number
  name: string
  city: string
  country: string
  iata: string
}

export async function getAirportsByCity(city: string): Promise<Airport[]> {
  try {
    const response = await fetch('/api/airports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: city }),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch airport data')
    }

    const data: AirportApiDTO[] = await response.json()

    const airports: Airport[] = data.map(({ name, iata, city, id, country }) => ({
      name,
      iata,
      city,
      id,
      country,
    }))

    return airports
  }
  catch (error) {
    throw new Error(`An error occurred while fetching airport info: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
