import { useContext } from 'react'
import { FlightsContext } from '../context'

export function useFlights() {
  const context = useContext(FlightsContext)

  if (!context) {
    throw new Error('Flights context must be used within a FlightsProvider')
  }

  return context
}
