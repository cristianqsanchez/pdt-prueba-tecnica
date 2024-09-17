import React, { createContext, useMemo, useState } from 'react'
import type { Flight } from '../types'

type UserTravel = {
  departureCity: string
  departureAirport: string
  arrivalCity: string
  arrivalAirport: string
  departureDate: string
}

type FlightsContextProps = {
  userTravel: UserTravel | undefined
  setUserTravel: React.Dispatch<React.SetStateAction<UserTravel | undefined>>
  flightResults: Flight[] | undefined
  setFlightResults: React.Dispatch<React.SetStateAction<Flight[] | undefined>>
}

export const FlightsContext = createContext<FlightsContextProps | undefined>(undefined)

export function FlightsProvider({ children }: { children: React.ReactNode }) {
  const [userTravel, setUserTravel] = useState<UserTravel>()
  const [flightResults, setFlightResults] = useState<Flight[]>()

  const value = useMemo(
    () => ({ userTravel, setUserTravel, flightResults, setFlightResults }),
    [userTravel, setUserTravel, flightResults, setFlightResults],
  )
  return (
    <FlightsContext.Provider value={value}>
      {children}
    </FlightsContext.Provider>
  )
}
