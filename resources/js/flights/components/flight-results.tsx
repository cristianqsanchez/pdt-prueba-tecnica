import { useState } from 'react'
import type { Flight } from '../types'
import { useFlights } from '../hooks/use-flights-context'
import { getAirlineLogo } from '../services/airlines.service'
import { storeFlightBooking } from '../services/booking.service'

import { format } from 'date-fns'
import { toast } from 'sonner'

import { Button } from '@/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table'
import { ChevronLeft, ChevronRight, PlaneLanding, PlaneTakeoff } from 'lucide-react'

export function FlightResults() {
  const { userTravel, flightResults } = useFlights()

  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({ airline: '' })
  const itemsPerPage = 5

  const uniqueAirlines = [
    ...new Map(
      flightResults?.map(flight => ({
        name: flight.companyName,
        id: flight.marketingCarrier,
      })).map(item => [item.name, item]),
    ).values(),
  ]

  const filteredFlights = flightResults?.filter((flight) => {
    return (
      (filters.airline === '' || flight.marketingCarrier === filters.airline)
    )
  }) || []

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFlights = filteredFlights.slice(startIndex, endIndex)

  const handleFilterChange = (select: string) => {
    const value = select === 'all' ? '' : select
    setFilters({ ...filters, airline: value })
    setCurrentPage(1)
  }

  const handleBookingAction = (flight: Flight) => {
    storeFlightBooking({
      origin: userTravel!.departureCity,
      destination: userTravel!.arrivalCity,
      departure_time: userTravel!.departureDate,
      itineraries: [
        {
          origin: flight.locationId.departureCity,
          destination: flight.locationId.arrivalCity,
          departure_time: flight.dateOfDeparture,
          arrival_time: flight.dateOfArrival,
        },
      ],
    }).then(() => {
      toast.success('Booking confirmed! Your trip has been scheduled successfully.')
    }).catch(() => {
      toast.error('There was an issue with your booking. Please try again or contact support')
    })
  }

  return (
    <div>
      <h1 className='flex gap-2 text-xl mb-4'>
        Your travel results from
        {' '}
        <span className='font-semibold'>
          {userTravel?.departureCity}
        </span>
        {' '}
        to
        {' '}
        <span className='font-semibold'>
          {userTravel?.arrivalCity}
        </span>
        {' '}
        {userTravel && (
          <span>{`on ${format(userTravel.departureDate, 'MMMM do, yyyy')}`}</span>
        )}
      </h1>
      <div className='grid grid-cols-3 gap-4'>
        <Select name='airline' onValueChange={handleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder='Airline' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>
              <span>All Airlines</span>
            </SelectItem>
            {uniqueAirlines.map(airline => (
              <SelectItem key={airline.id} value={airline.id}>
                <div className='flex items-cente items-center gap-2'>
                  <img src={getAirlineLogo(airline.id)} />
                  <span className='line-clamp-1'>{airline.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Airline</TableHead>
            <TableHead>
              <span className='flex items-center gap-1'>
                <PlaneTakeoff className='size-4' />
                Departure
              </span>
            </TableHead>
            <TableHead>
              <span className='flex items-center gap-1'>
                <PlaneLanding className='size-4' />
                Arrival
              </span>
            </TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentFlights.map((flight, index) => {
            return (
              <TableRow key={index} className='max-h-8'>
                <TableCell>
                  <img
                    className='max-h-12'
                    title={flight.companyName}
                    src={getAirlineLogo(flight.marketingCarrier)}
                    alt={`Logo of ${flight.companyName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className='w-fit flex flex-col gap-2'>
                    <span className='self-end'>
                      {flight.timeOfDeparture}
                    </span>
                    <span>
                      {`Airport ${userTravel?.departureAirport} - ${userTravel?.departureCity}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='w-fit flex flex-col gap-2'>
                    <span className='self-end'>
                      {flight.timeOfArrival}
                    </span>
                    <span>
                      {`Airport ${userTravel?.arrivalAirport} - ${userTravel?.arrivalCity}`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant='outline'
                    onClick={() => handleBookingAction(flight)}
                  >
                    Book Flight
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
            Previous
          </Button>
          <Button
            variant='outline'
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
        <span>
          Page
          {currentPage}
          {' '}
          of
          {' '}
          {totalPages}
        </span>
      </div>
    </div>
  )
}
