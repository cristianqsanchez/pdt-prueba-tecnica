import React, { useRef, useState } from 'react'
import { useFlights } from '../hooks/use-flights-context'
import { type Airport, getAirportsByCity } from '../services/airports.service'
import { searchFlights } from '../services/flights.service'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { navigate } from 'wouter/use-browser-location'

import { SearchableDropdown } from './searchable-dropdown'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { CalendarIcon, Loader2, Plane } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

export function FlightBookingForm() {
  const [date, setDate] = useState<Date>()
  const [departureAirport, setDepartureAirport] = useState<Airport>()
  const [arrivalAirport, setArrivalAirport] = useState<Airport>()
  const [isLoading, setIsLoading] = useState(false)

  const departureRef = useRef<{ getDestinations: () => Airport[] } | null>(null)
  const arrivalRef = useRef<{ getDestinations: () => Airport[] } | null>(null)
  const dateRef = useRef<HTMLButtonElement | null>(null)

  const { setUserTravel, setFlightResults } = useFlights()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    if (!date || !departureAirport || !arrivalAirport)
      return

    const formattedDate = format(date, 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
    const passengers = Number(formData.get('passengers') as string)

    setIsLoading(true)

    const flights = await searchFlights({
      searchs: 10,
      adult: passengers,
      qtyPassengers: passengers,
      itinerary: [
        {
          departureCity: departureAirport?.iata,
          arrivalCity: arrivalAirport?.iata,
          hour: formattedDate,
        },
      ],
    }).catch(() => {
      setIsLoading(false)
      toast.warning('Oops, no flights found!')
    })

    if (!flights) {
      setIsLoading(false)
      return
    }

    setUserTravel({
      departureCity: departureAirport.city,
      departureAirport: departureAirport.name,
      arrivalCity: arrivalAirport.city,
      arrivalAirport: arrivalAirport.name,
      departureDate: formattedDate,
    })
    setFlightResults(flights)
    setIsLoading(false)

    if (flights)
      return navigate('/results')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book a Flight</CardTitle>
        <CardDescription>Enter your flight details below.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1.5'>
              <SearchableDropdown
                id='departure'
                label='Departure City'
                ref={departureRef}
                fetchDestinations={getAirportsByCity}
                onSelect={(dest: Airport) => setDepartureAirport(dest)}
                placeholder='Medellín'
              />
            </div>
            <div className='space-y-1.5'>
              <SearchableDropdown
                id='arrival'
                label='Arrival City'
                ref={arrivalRef}
                fetchDestinations={getAirportsByCity}
                onSelect={(dest: Airport) => {
                  setArrivalAirport(dest)
                  dateRef.current?.focus()
                }}
                placeholder='Bogotá'
              />
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='date'>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    ref={dateRef}
                    id='date'
                    name='date'
                    variant='outline'
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {date ? format(date, 'PPP', { locale: es }) : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    locale={es}
                    disabled={{ before: new Date() }}
                    mode='single'
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className='rounded-md border'
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className='flex items-end gap-2 space-y-1.5'>
              <div>
                <Label htmlFor='time'>Time</Label>
                <Input required id='time' type='number' placeholder='2' min={1} max={12} />
              </div>
              <Select defaultValue='pm'>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='am'>AM</SelectItem>
                  <SelectItem value='pm'>PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-1.5'>
              <Label htmlFor='passengers'>Passengers</Label>
              <Input
                id='passengers'
                name='passengers'
                type='number'
                min='1'
                max='10'
                placeholder='Number of passengers'
                required
              />
            </div>
            <div className='space-y-1.5 flex items-end'>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading ? <Loader2 className='mr-2 size-4 animate-spin' /> : <Plane className='mr-2 size-4' />}
                {' '}
                Book Flight
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
