import React from 'react'
import { Route, Router } from 'wouter'
import { FlightResults } from './flights/components/flight-results'
import { Landing } from './flights/pages/landing'

export function App() {
  return (
    <Router>
      <Route path='/' component={Landing} />
      <Route path='/results' component={FlightResults} />
    </Router>
  )
}
